import { Trace, Data } from '@/interfaces';

let nextId = 0;

export function parseLogFile(file: File, content: string): Trace {
    const delimiter = '\t';
    const lines = content.split('\n');

    let headers: string[] = [];
    let headersParsed = false;
    const rawSamples: Array<{ state: number; data: { [key: string]: number | null } }> = [];

    for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed) continue;
        if (trimmed.startsWith('#') || trimmed.startsWith('[')) continue;

        if (!headersParsed) {
            headers = trimmed.split(delimiter);
            headers[0] = 'state';
            headersParsed = true;
            continue;
        }

        const values = trimmed.split(delimiter);
        if (values.length < headers.length) continue;

        const data: { [key: string]: number | null } = {};
        for (let i = 0; i < headers.length; i++) {
            const parsed = parseFloat(values[i]);
            data[headers[i]] = isFinite(parsed) ? parsed : null;
        }
        rawSamples.push({ state: data['state'] as number, data });
    }

    if (!headersParsed || headers.length < 2) {
        throw new Error(`Could not parse headers from ${file.name}`);
    }

    const parameters: { [key: string]: Data[] } = {};
    for (const header of headers) {
        parameters[header] = rawSamples.map(s => ({ state: s.state, value: s.data[header] }));
    }

    const id = nextId++;
    return {
        id,
        path: file.name,
        headers_line: headers.join(delimiter),
        delimiter,
        last_byte: content.length,
        parameters,
        activeParams: headers.filter(h => h !== 'state').slice(0, 3),
        isActive: false,
        burnIn: 0,
        isLoading: false,
    };
}

export function readFileAsText(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = e => resolve(e.target!.result as string);
        reader.onerror = () => reject(new Error(`Failed to read ${file.name}`));
        reader.readAsText(file);
    });
}
