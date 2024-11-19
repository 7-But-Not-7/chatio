import axios from "axios";
import { APIEndpoints } from "../constants/api-endpoints";

export const getHello = async () => {
   try {
     const { data } = await axios.get(APIEndpoints.HELLO);
     return data;
   } catch (error) {
     console.error(error);
     return null;
   }
};