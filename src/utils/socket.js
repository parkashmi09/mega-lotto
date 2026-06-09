/**
 * Socket encode/decode – same contract as jackopot (Blob out, ArrayBuffer/Blob in).
 */

export function encode(data) {
  try {
    return new Blob([JSON.stringify(data)]);
  } catch (e) {
    console.error('Error encoding data:', e);
    return data;
  }
}

export function decode(data) {
  try {
    const responseData = new TextDecoder().decode(data);
    return JSON.parse(responseData);
  } catch (e) {
    console.error('Error decoding data:', e);
    return null;
  }
}
