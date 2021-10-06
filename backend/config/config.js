export const privateData = {
    secret: 'ochen-secretnoe-slovo',
    jwt: {
        secret: 'ochen-secretnoe-slovo',
        tokens: {
            access: {
                type: 'access',
                expiresIn: 120,
            },
            refresh: {
                type: 'refresh',
                expiresIn: 60*60*24,
            }
        }
    }
}

