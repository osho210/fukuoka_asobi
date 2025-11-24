export { };

declare global {
    interface Window {
        google?: {
            accounts?: {
                id?: {
                    initialize: (options: {
                        client_id: string;
                        callback: (response: any) => void;
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
