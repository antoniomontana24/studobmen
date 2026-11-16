/**
 * Превращает выбранный файл в сжатый data-URL (JPEG, до 1280 px по длинной стороне).
 *
 * Почему не URL.createObjectURL: blob-ссылка живёт только до перезагрузки страницы, а объявления
 * сохраняются в localStorage — после обновления страницы картинка «пропадала». Data-URL — это сам
 * файл в виде строки, он переживает перезагрузку. Сжатие нужно, чтобы уложиться в лимит localStorage (~5 МБ).
 * Когда появится backend, вместо этого файл отправляется через FormData, а в объявление пишется URL с сервера.
 */
const MAX_SIDE = 1280;

export async function fileToDataUrl(file: File): Promise<string> {
  const bmp = await createImageBitmap(file); // учитывает EXIF-поворот; бросает ошибку на неподдерживаемых форматах
  try {
    const k = Math.min(1, MAX_SIDE / Math.max(bmp.width, bmp.height));
    const canvas = document.createElement('canvas');
    canvas.width = Math.round(bmp.width * k);
    canvas.height = Math.round(bmp.height * k);
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('canvas unavailable');
    ctx.fillStyle = '#fff'; // прозрачные PNG не должны стать чёрными в JPEG
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(bmp, 0, 0, canvas.width, canvas.height);
    return canvas.toDataURL('image/jpeg', 0.8);
  } finally {
    bmp.close();
  }
}
