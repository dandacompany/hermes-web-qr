export function normalizeAddress(input: string): string {
 if (typeof input !== 'string' || !input.trim() || input.length > 1024) throw new Error('urlRequired');
 let url: URL;
 try { url = new URL(input.trim()); } catch { throw new Error('urlInvalid'); }
 if (url.protocol !== 'https:') throw new Error('urlHttps');
 if (url.username || url.password || url.search || url.hash) throw new Error('urlCredentials');
 const h = url.hostname.toLowerCase().replace(/\.$/, '');
 if (h === 'localhost' || h.endsWith('.localhost') || h.startsWith('127.') || h === '0.0.0.0' || h === '[::1]' || h === '[::]' || /^\[::ffff:(?:7f[0-9a-f]{2}:|0:0\])/.test(h)) throw new Error('urlLocal');
 return url.href;
}
