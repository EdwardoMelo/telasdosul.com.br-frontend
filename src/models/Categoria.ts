
import { api } from "../api";
import { SubcategoriaDTO } from "./SubCategoria";

export interface CategoriaDTO {
  id: number;
  nome: string;
  subcategorias: SubcategoriaDTO[];
  imagem?: string;
}

export class Categoria {
  id: number;
  nome: string;
  subcategorias: SubcategoriaDTO[];
  imagem: string;

  constructor(data: CategoriaDTO) {
    this.id = data.id;
    this.nome = data.nome;
    this.subcategorias = data.subcategorias;
    this.imagem = data.imagem;
  }

  static async getAll(): Promise<Categoria[]> {
    console.log("getAll");
    const response = await api.get<CategoriaDTO[]>("/categorias");
    return response.data.map((categoria) => new Categoria(categoria));
  }

  static async getById(id: number): Promise<Categoria> {
    const response = await api.get<CategoriaDTO>(`/categorias/${id}`);
    return new Categoria(response.data);
  }

  async create(): Promise<Categoria> {
    const response = await api.post<CategoriaDTO>("/categorias", {
      nome: this.nome,
    });
    this.id = response.data.id;
    return this;
  }

  async update(): Promise<Categoria> {
    const response = await api.put<CategoriaDTO>(`/categorias/${this.id}`, {
      nome: this.nome,
      imagem: this.imagem
    });
    return new Categoria(response.data);
  }

  async delete(): Promise<void> {
    await api.delete(`/categorias/${this.id}`);
  }
}
