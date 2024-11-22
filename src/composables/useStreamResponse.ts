/*export default function useStreamResponse() {
  function getIterable(readableStream: ReadableStream<Uint8Array>) {
    if (!(readableStream instanceof ReadableStream)) {
      throw new Error('Response is not a readable stream');
    }

    const reader = readableStream.getReader();
    const decoder = new TextDecoder('utf-8');

    let done = false;

    return {
      [Symbol.asyncIterator]() {
        return {
          async next() {
            while (!done) {
              const { value, done: _done } = await reader.read();
              done = _done;
              const chunk = decoder.decode(value, {
                stream: true,
              });
              return {
                done: false,
                value: chunk,
                // .split('\n')
                // .map((line) => line.trim())
                // .filter((line) => line.startsWith('data: '))
                // .map((line) => JSON.parse(line.slice(6).trim())),
              };
            }

            return { done: true, value: undefined };
          },
        };
      },
    };
  }

  return {
    getIterable,
  };
}*/

export default function useStreamResponse() {
  const decoder = new TextDecoder('utf-8');
  let buffer = '';
  const messageQueue: string[] = [];
  let isPending = false;

  async function processQueue() {
    while (messageQueue.length > 0) {
      const line = messageQueue.shift();
      if (line?.trim().startsWith('data: ')) {
        try {
          const { message } = JSON.parse(line.slice(6).trim());
          return { done: false, value: message };
        } catch (e) {
          console.error('Error parsing JSON:', e);
          return { done: true, value: undefined };
        }
      }
    }
    return { done: false, value: undefined };
  }

  function getIterable(readableStream: ReadableStream<Uint8Array>) {
    if (!(readableStream instanceof ReadableStream)) {
      throw new Error('Response is not a readable stream');
    }

    const reader = readableStream.getReader();
    let reading = true;

    return {
      [Symbol.asyncIterator]() {
        return {
          async next(): Promise<IteratorResult<string | undefined>> {
            try {
              if (!reading) {
                // Flush any remaining buffer when stream ends
                const finalChunk = decoder.decode();
                if (finalChunk) {
                  buffer += finalChunk;
                  const lines = buffer.split('\n');
                  messageQueue.push(...lines);
                  buffer = '';
                  const result = await processQueue();
                  if (result.value !== undefined) {
                    return result;
                  }
                }
                return { done: true, value: undefined };
              }

              // Process queued messages if any exist
              if (messageQueue.length > 0 && !isPending) {
                isPending = true;
                const result = await processQueue();
                isPending = false;
                if (result.value !== undefined) {
                  return result;
                }
              }

              // Read next chunk
              const { done, value } = await reader.read();
              if (done) {
                reading = false;
                return this.next();
              }

              buffer += decoder.decode(value, { stream: true });
              const lines = buffer.split('\n');
              buffer = lines.pop() || '';

              if (lines.length > 0) {
                messageQueue.push(...lines);
                return processQueue();
              }

              return { done: false, value: undefined };
            } catch (error) {
              reading = false;
              await reader.cancel();
              throw error;
            }
          },
          async return() {
            reading = false;
            await reader.cancel();
            return { done: true, value: undefined };
          },
        };
      },
    };
  }

  return {
    getIterable,
  };
}

/*export default function useStreamResponse() {
  const decoder = new TextDecoder('utf-8');
  let buffer = '';

  function getIterable(readableStream: ReadableStream<Uint8Array>) {
    if (!(readableStream instanceof ReadableStream)) {
      throw new Error('Response is not a readable stream');
    }

    const reader = readableStream.getReader();
    let reading = true;

    return {
      [Symbol.asyncIterator]() {
        return {
          async next() {
            if (!reading) {
              return { done: true, value: undefined };
            }

            const { done, value } = await reader.read();
            if (done) {
              return { done: true, value: undefined };
            }

            // Append new chunk to buffer
            buffer += decoder.decode(value, { stream: true });

            // Split on newlines, keeping any remainder in the buffer
            const lines = buffer.split('\n');
            buffer = lines.pop() || ''; // Keep the last incomplete line

            for (const line of lines) {
              const trimmedLine = line.trim();
              if (trimmedLine.startsWith('data: ')) {
                try {
                  const { message } = JSON.parse(trimmedLine.slice(6).trim());
                  return { done: false, value: message };
                } catch (e) {
                  await reader.cancel();
                  reading = false;
                  console.error('Error parsing JSON:', e);
                  return { done: true, value: undefined };
                }
              }
            }

            return { done: false, value: undefined };
          },
        };
      },
    };
  }

  return {
    getIterable,
  };
}*/
