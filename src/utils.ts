import { add } from "date-fns";
import { api } from "./api";


export const contactInfo = {
    phone: "+55 51 998951079",
    email: "V2l0E@example.com",
    instagram: 'https://www.instagram.com/Telas_e_Cia_RS_sl/',
    facebook: 'https://www.facebook.com/Telas_e_Cia_RS/',
    linkedin: 'https://www.linkedin.com/company/telas-e-cia-rs/',
    address: 'Rua Dario Nicolau Sturmer, 75 - Prédio 2 - Feitoria / São Leopoldo/RS 93048-390',
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