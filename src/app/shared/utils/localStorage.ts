export function saveStorageData_fs(dataFs) {
    localStorage.setItem("DATA_EXCEL", JSON.stringify(dataFs));
}

export function getStorageData_fs() {
    const storage_data = localStorage.getItem("DATA_EXCEL");
    const storage_coment = localStorage.getItem("PREV_COMENTARIO");
    return {
        storage_data,
        storage_coment
    }
}