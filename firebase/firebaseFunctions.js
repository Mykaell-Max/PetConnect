const {getStorage, ref, uploadBytes, deleteObject, getDownloadURL} = require("firebase/storage");
const {firebaseApp} = require('../config/firebaseSetup');

const storage = getStorage(firebaseApp);


async function uploadFile(image_name, folder, image_file){
    try {
        const storageRef = ref(storage, `${folder}/${image_name}`);

        await uploadBytes(storageRef, image_file.buffer);
        const imageURL = await getDownloadURL(storageRef);

        return {
            status: 1,
            url: String(imageURL)
        };
    } 
    catch (error) {
        return {
            status: 0,
            error: error.message
        };
    }
}


async function deleteFile(name, folder){
    try {
        const storageRef = ref(storage, `${folder}/${name}`);

        await deleteObject(storageRef);

        return {
            status: 1,
            message: "Deleted successfully!"
        };
    } 
    catch (error) {
        return {
            status: 0,
            error: error.message
        };
    }
}


module.exports = {uploadFile, deleteFile};