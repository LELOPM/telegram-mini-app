-- Atomic checkout function for creating orders from cart
-- This function handles the entire checkout process atomically:
-- 1. Validates user's cart
-- 2. Checks product availability and stock
-- 3. Calculates total using current prices
-- 4. Creates order with checkout_id
-- 5. Creates order_items
-- 6. Decreases inventory
-- 7. Clears user's cart
-- All in a single atomic transaction

CREATE OR REPLACE FUNCTION public.create_order_from_cart(
    p_telegram_user_id BIGINT,
    p_checkout_id UUID,
    p_customer_name TEXT,
    p_phone TEXT,
    p_delivery_address TEXT
)
RETURNS TABLE (
    order_id UUID,
    total NUMERIC,
    status TEXT,
    created_at TIMESTAMPTZ
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_order_id UUID;
    v_total NUMERIC := 0;
    v_cart_item RECORD;
    v_product RECORD;
    v_new_stock INTEGER;
BEGIN
    -- Validate inputs
    IF p_telegram_user_id IS NULL OR p_telegram_user_id <= 0 THEN
        RAISE EXCEPTION 'Invalid telegram_user_id';
    END IF;
    
    IF p_checkout_id IS NULL THEN
        RAISE EXCEPTION 'Invalid checkout_id';
    END IF;
    
    IF p_customer_name IS NULL OR p_customer_name = '' THEN
        RAISE EXCEPTION 'Customer name is required';
    END IF;
    
    IF p_phone IS NULL OR p_phone = '' THEN
        RAISE EXCEPTION 'Phone is required';
    END IF;
    
    IF p_delivery_address IS NULL OR p_delivery_address = '' THEN
        RAISE EXCEPTION 'Delivery address is required';
    END IF;

    -- Check if checkout_id already exists (duplicate submission protection)
    IF EXISTS (SELECT 1 FROM public.orders WHERE checkout_id = p_checkout_id) THEN
        RAISE EXCEPTION 'Duplicate checkout_id - order already exists';
    END IF;

    -- Lock the user's cart items for update to prevent concurrent modifications
    FOR v_cart_item IN
        SELECT ci.id, ci.product_id, ci.quantity
        FROM public.cart_items ci
        WHERE ci.telegram_user_id = p_telegram_user_id
        FOR UPDATE
    LOOP
        -- Get product details with row lock to prevent concurrent stock changes
        SELECT p.id, p.name, p.price, p.stock, p.status
        INTO v_product
        FROM public.products p
        WHERE p.id = v_cart_item.product_id
        FOR UPDATE;

        -- Validate product exists
        IF v_product IS NULL THEN
            RAISE EXCEPTION 'Product % no longer exists', v_cart_item.product_id;
        END IF;

        -- Validate product is active/available
        IF v_product.status != 'active' THEN
            RAISE EXCEPTION 'Product % is no longer available', v_product.name;
        END IF;

        -- Validate stock
        IF v_product.stock < v_cart_item.quantity THEN
            RAISE EXCEPTION 'Insufficient stock for product % (requested: %, available: %)', 
                v_product.name, v_cart_item.quantity, v_product.stock;
        END IF;

        -- Calculate line total using current database price
        v_total := v_total + (v_product.price * v_cart_item.quantity);

        -- Decrease inventory atomically
        v_new_stock := v_product.stock - v_cart_item.quantity;
        UPDATE public.products
        SET stock = v_new_stock
        WHERE id = v_product.id;

        -- Create order_item (will be linked to order after order creation)
        -- We'll insert order_items after order creation
    END LOOP;

    -- Check if cart was empty
    IF v_total = 0 THEN
        RAISE EXCEPTION 'Cart is empty';
    END IF;

    -- Create the order
    INSERT INTO public.orders (
        id,
        checkout_id,
        telegram_user_id,
        customer_name,
        phone,
        delivery_address,
        total,
        status,
        created_at
    ) VALUES (
        gen_random_uuid(),
        p_checkout_id,
        p_telegram_user_id,
        p_customer_name,
        p_phone,
        p_delivery_address,
        v_total,
        'pending',
        now()
    ) RETURNING id INTO v_order_id;

    -- Create order_items and clear cart in same transaction
    FOR v_cart_item IN
        SELECT ci.id, ci.product_id, ci.quantity
        FROM public.cart_items ci
        WHERE ci.telegram_user_id = p_telegram_user_id
    LOOP
        -- Get product details again for order_item
        SELECT p.name, p.price
        INTO v_product
        FROM public.products p
        WHERE p.id = v_cart_item.product_id;

        INSERT INTO public.order_items (
            id,
            order_id,
            product_id,
            product_name,
            price,
            quantity,
            created_at
        ) VALUES (
            gen_random_uuid(),
            v_order_id,
            v_cart_item.product_id,
            v_product.name,
            v_product.price,
            v_cart_item.quantity,
            now()
        );

        -- Delete cart item
        DELETE FROM public.cart_items
        WHERE id = v_cart_item.id;
    END LOOP;

    -- Return order confirmation
    RETURN QUERY
    SELECT o.id, o.total, o.status, o.created_at
    FROM public.orders o
    WHERE o.id = v_order_id;
END;
$$;

-- Grant execute permission to the service role
GRANT EXECUTE ON FUNCTION public.create_order_from_cart(BIGINT, UUID, TEXT, TEXT, TEXT) TO service_role;