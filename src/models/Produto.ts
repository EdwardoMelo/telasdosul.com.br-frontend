
import { api } from "../api";
import { Categoria, CategoriaDTO } from "./Categoria";
import { Subcategoria, SubcategoriaDTO } from "./SubCategoria";
import { VariacaoProdutoDTO } from "./VariacaoProduto";

export interface ProdutoDTO {
  id: number;
  nome: string;
  descricao?: string;
  preco: number;
  marca?: string;
  imagem?: string;
  estoque: number;
  categoria_id: number;
  subcategoria_id?: number;
  created_at?: string;
  updated_at?: string;
  categoria?: CategoriaDTO;
  subcategoria?: SubcategoriaDTO;
  variacoes?: VariacaoProdutoDTO[];
}

export class Produto {
  id: number;
  nome: string;
  descricao?: string;
  preco: number;
  marca?: string;
  imagem?: string;
  estoque: number;
  categoria_id: number;
  subcategoria_id?: number;

  created_at?: Date;
  updated_at?: Date;
  categoria?: Categoria;
  subcategoria?: Subcategoria;
  variacoes?: VariacaoProdutoDTO[];

  constructor(data: ProdutoDTO) {
    this.id = data.id;
    this.nome = data.nome;
    this.descricao = data.descricao;
    this.preco = data.preco;
    this.marca = data.marca;
    this.imagem = data.imagem;
    this.estoque = data.estoque;
    this.categoria_id = data.categoria_id;
    this.created_at = data.created_at ? new Date(data.created_at) : undefined;
    this.updated_at = data.updated_at ? new Date(data.updated_at) : undefined;
    this.categoria = data.categoria ? new Categoria(data.categoria) : undefined;
    this.subcategoria_id = data.subcategoria_id;
    this.subcategoria = data.subcategoria
      ? new Subcategoria(data.subcategoria)
      : undefined;
    this.variacoes = data.variacoes;
  }

  static async getAll(): Promise<Produto[]> {
    const response = await api.get<ProdutoDTO[]>("/produtos");
    return response.data.map((produto) => new Produto(produto));
  }

  static async getById(id: number): Promise<Produto> {
    const response = await api.get<ProdutoDTO>(`/produtos/${id}`);
    return new Produto(response.data);
  }

  static async getByCategoria(categoriaId: number): Promise<Produto[]> {
    const response = await api.get<ProdutoDTO[]>(
      `/produtos/categoria/${categoriaId}`
    );
    return response.data.map((produto) => new Produto(produto));
  }

  async create(): Promise<Produto> {
    const response = await api.post<ProdutoDTO>("/produtos", {
      nome: this.nome,
      descricao: this.descricao,
      preco: this.preco,
      marca: this.marca,
      imagem: this.imagem,
      estoque: this.estoque,
      categoria_id: this.categoria_id,
    });
    this.id = response.data.id;
    this.created_at = response.data.created_at
      ? new Date(response.data.created_at)
      : new Date();
    this.updated_at = response.data.updated_at
      ? new Date(response.data.updated_at)
      : new Date();
    return this;
  }

  async update(): Promise<Produto> {
    const response = await api.put<ProdutoDTO>(`/produtos/${this.id}`, {
      nome: this.nome,
      descricao: this.descricao,
      preco: this.preco,
      marca: this.marca,
      imagem: this.imagem,
      estoque: this.estoque,
      categoria_id: this.categoria_id,
    });
    this.updated_at = response.data.updated_at
      ? new Date(response.data.updated_at)
      : new Date();
    return this;
  }

  async delete(): Promise<void> {
    await api.delete(`/produtos/${this.id}`);
  }
}
