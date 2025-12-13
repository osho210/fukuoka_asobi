export { };

interface GoogleCredentialResponse {
    credential: string;
    select_by?: string;
    client_id?: string;
}

declare global {
    interface Window {
        google?: {
            accounts?: {
                id?: {
                    initialize: (options: {
                        client_id: string;
                        callback: (response: GoogleCredentialResponse) => void;
                    }) => void;
                    renderButton: (
                        parent: HTMLElement,
                        options: {
                            theme?: string;
                            size?: string;
                            text?: string;
                            width?: string | number;
                            locale?: string;
                        }
                    ) => void;
                    prompt?: () => void;
                };
            };
        };
    }
}
