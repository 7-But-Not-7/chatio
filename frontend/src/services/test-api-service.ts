import axios from "axios";

export const getHello = async () => {
   try {
     const { data } = await axios.get("/api/");
     return data;
   } catch (error) {
     console.error(error);
     return null;
   }
};