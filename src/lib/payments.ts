/// <reference types="vite/client" />

const LS_API_URL = 'https://api.lemonsqueezy.com/v1/checkouts'

interface CheckoutResponse {
    data: {
        attributes: {
            url: string
        }
    }
}

async function createCheckout(
    userId: string,
    email: string,
    variantId: string
): Promise<string> {
    const apiKey = import.meta.env.VITE_LEMONSQUEEZY_API_KEY
    const storeId = import.meta.env.VITE_LEMONSQUEEZY_STORE_ID

    if (!apiKey || !storeId || !variantId) {
        throw new Error('Lemon Squeezy env vars not configured')
    }

    const res = await fetch(LS_API_URL, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${apiKey}`,
            Accept: 'application/vnd.api+json',
            'Content-Type': 'application/vnd.api+json',
        },
        body: JSON.stringify({
            data: {
                type: 'checkouts',
                attributes: {
                    checkout_data: {
                        email,
                        custom: { userId },
                    },
                },
                relationships: {
                    store: {
                        data: { type: 'stores', id: storeId },
                    },
                    variant: {
                        data: { type: 'variants', id: variantId },
                    },
                },
            },
        }),
    })

    if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(`Lemon Squeezy error ${res.status}: ${JSON.stringify(err)}`)
    }

    const json: CheckoutResponse = await res.json()
    return json.data.attributes.url
}

/** Creates a Lemon Squeezy checkout URL for the PRO plan ($9/mo).
 *  Returns the hosted checkout URL to redirect the user to. */
export async function createProCheckout(userId: string, email: string): Promise<string> {
    const variantId = import.meta.env.VITE_LEMONSQUEEZY_PRO_VARIANT_ID
    return createCheckout(userId, email, variantId)
}

/** Creates a Lemon Squeezy checkout URL for the AGENCY plan ($29/mo).
 *  Returns the hosted checkout URL to redirect the user to. */
export async function createAgencyCheckout(userId: string, email: string): Promise<string> {
    const variantId = import.meta.env.VITE_LEMONSQUEEZY_AGENCY_VARIANT_ID
    return createCheckout(userId, email, variantId)
}
