export async function withSpinner<T>(
    container: HTMLElement,
    task: () => Promise<T>,
): Promise<T> {
    container.empty();
    const spin = container.createDiv({ cls: "lds-library-spinner" });
    try {
        return await task();
    } finally {
        spin.remove();
    }
}
