import ImageKit from "imagekit";

const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
});

export const uploadToImageKit = async (file, fileName, folder = 'pins') => {
    try {
        const base64String = file.buffer.toString('base64');

        const result = await imagekit.upload({
            file: base64String,
            fileName: fileName,
            folder: folder,
            useUniqueFileName: true
        });

        return {
            fileId: result.fileId,
            url: result.url,
            name: result.name,
            width: result.width,
            height: result.height
        };
    } catch (error) {
        throw error;
    }
};

export const deleteFromImageKit = async (fileId) => {
    try {
        const result = await imagekit.deleteFile(fileId);
        return result;
    } catch (error) {
        throw error;
    }
};

export default imagekit;

