import { api } from "../api";
import { Categoria, CategoriaDTO } from "./Categoria";

export interface SubcategoriaDTO {
    id: number;
    nome: string;
    descricao?: string; // Adicionado o campo descricao
    categoria_id: number;
    created_at?: string;
    updated_at?: string;
    categoria?: CategoriaDTO;
}

export class Subcategoria {
    id: number;
    nome: string;
    descricao?: string; // Adicionado o campo descricao
    categoria_id: number;
    created_at?: Date;
    updated_at?: Date;
    categoria?: Categoria;

    constructor(data: SubcategoriaDTO) {
        this.id = data.id;
        this.nome = data.nome;
        this.descricao = data.descricao; // Inicializando o campo descricao
        this.categoria_id = data.categoria_id;
        this.created_at = data.created_at ? new Date(data.created_at) : undefined;
        this.updated_at = data.updated_at ? new Date(data.updated_at) : undefined;
        this.categoria = data.categoria ? new Categoria(data.categoria) : undefined;
    }

    static async getAll(): Promise<Subcategoria[]> {
        const response = await api.get<SubcategoriaDTO[]>("/subcategorias");
        return response.data.map((subcategoria) => new Subcategoria(subcategoria));
    }

    static async getById(id: number): Promise<Subcategoria> {
        const response = await api.get<SubcategoriaDTO>(`/subcategorias/${id}`);
        return new Subcategoria(response.data);
    }

    async create(): Promise<SubcategoriaDTO> {
        const response = await api.post<SubcategoriaDTO>("/subcategorias", {
            nome: this.nome,
            descricao: this.descricao, // Incluído o campo descricao
            categoria_id: this.categoria_id,
        });
        this.id = response.data.id;
        this.created_at = response.data.created_at
            ? new Date(response.data.created_at)
            : new Date();
        this.updated_at = response.data.updated_at
            ? new Date(response.data.updated_at)
            : new Date();
        return response.data;
    }

    static async createManyByCategoryId(categoria_id: number, subcategorias: SubcategoriaDTO[]) : Promise<SubcategoriaDTO[]> {
        console.log("Subcategorias: ", subcategorias)
        const response = await api.post(`/subcategorias/categoria/${categoria_id}`, { 
            subcategorias
        });
        return response.data;
    }

    async update(): Promise<SubcategoriaDTO> {
        const response = await api.put<SubcategoriaDTO>(
            `/subcategorias/${this.id}`,
            {
                nome: this.nome,
                descricao: this.descricao, // Incluído o campo descricao
                categoria_id: this.categoria_id,
            }
        );
        this.updated_at = response.data.updated_at
            ? new Date(response.data.updated_at)
            : new Date();
        return response.data;
    }

    async delete(): Promise<void> {
        await api.delete(`/subcategorias/${this.id}`);
    }
}
