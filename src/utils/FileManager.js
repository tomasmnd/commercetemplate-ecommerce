import { promises as fs } from "fs";
import Logger from "./Logger";
class FileManager {
  constructor(path) {
    this.path = path;
  }

  saveInFile = async (data) => {
    try {
      await fs.writeFile(this.path, JSON.stringify(data));
    } catch (error) {
      Logger.error("Ocurrió un error guardando datos en el archivo: ", error);
    }
  };

  getFromFile = async () => {
    try {
      const savedData = await fs.readFile(this.path, "utf-8");
      return JSON.parse(savedData);
    } catch (error) {
      Logger.error("Error obteniendo datos desde archivo:", error);
    }
  };

  getFromFileByID = async (id) => {
    try {
      const savedData = await this.getFromFile();
      const foundedData = savedData.find((p) => p.id === id);
      return foundedData ? foundedData : `No existe un item con id: ${id}`;
    } catch (error) {
      Logger.error("Error obteniendo datos desde archivo:", error);
    }
  };

  getFromFileWithLimit = async (limit) => {
    try {
      const savedData = await this.getFromFile();
      return savedData.slice(0, limit);
    } catch (error) {
      Logger.error("Error obteniendo datos desde archivo:", error);
    }
  };

  deleteInFile = async (id) => {
    try {
      const savedData = await this.getFromFile();
      const newList = savedData.filter((p) => p.id !== id);
      this.products = newList;
      await this.saveInFile(this.products);
    } catch (error) {
      Logger.error(
        "Ocurrió un error eliminando un registro desde archivo",
        error
      );
    }
  };

  updateInFile = async (id, newValue) => {
    try {
      const savedData = await this.getFromFile();
      const updatedList = savedData.map((p) =>
        p.id === id ? { ...p, ...newValue } : p
      );

      await this.saveInFile(updatedList);
    } catch (error) {
      Logger.error(
        "Ocurrió un error actualizando un registro en el archivo:",
        error
      );
    }
  };
}
export default FileManager;
