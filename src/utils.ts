import { add } from "date-fns";
import { api } from "./api";


export const contactInfo = {
  phone: "+55 51 999736919",
  email: "telasdosul@hotmail.com",
  instagram: "/",
  facebook: "/",
  linkedin: "/",
  address: "Av. Dr Pompílio Gomes Sobrinho 22.856",
};


const sendContactForm = async (data) => {
    try {
    const response = await api.post("/contato", data);
    return response.data;
    } catch (error) {
    console.error("Error sending contact form:", error);
    throw error;
    }
}

export  {sendContactForm}