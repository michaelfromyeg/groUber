const PREFIX = '--';

export function readProperty(name: string): string {
    const bodyStyles = window.getComputedStyle(document.body);
    return bodyStyles.getPropertyValue(PREFIX + name).trim();
}
