
import { api } from "../api";
import { Categoria, CategoriaDTO } from "./Categoria";
import { Subcategoria, SubcategoriaDTO } from "./SubCategoria";
import { VariacaoProdutoDTO } from "./VariacaoProduto";
import {
  LinhaPreco,
  LinhaPrecoDTO,
  LinhaPrecoInput,
  PrecoExibicao,
  TipoPrecoProduto,
} from "./LinhaPreco";

export interface ProdutoDTO {
  id: number;
  nome: string;
  descricao?: string;
  preco?: number | null;
  tipo_preco?: TipoPrecoProduto;
  metrica?: string | null;
  unidade_metrica?: string | null;
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
  linhas_preco?: LinhaPrecoDTO[];
  preco_exibicao?: PrecoExibicao | null;
}

export interface ProdutoPayload {
  nome: string;
  descricao?: string;
  preco?: number | null;
  tipo_preco?: TipoPrecoProduto;
  metrica?: string | null;
  unidade_metrica?: string | null;
  marca?: string;
  imagem?: string;
  estoque: number;
  categoria_id: number;
  subcategoria_id?: number | null;
}

export class Produto {
  id: number;
  nome: string;
  descricao?: string;
  preco?: number | null;
  tipo_preco: TipoPrecoProduto;
  metrica?: string | null;
  unidade_metrica?: string | null;
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
  linhas_preco?: LinhaPrecoDTO[];
  preco_exibicao?: PrecoExibicao | null;

  constructor(data: ProdutoDTO) {
    this.id = data.id;
    this.nome = data.nome;
    this.descricao = data.descricao;
    this.preco = data.preco != null ? Number(data.preco) : null;
    this.tipo_preco = data.tipo_preco ?? "FIXO";
    this.metrica = data.metrica ?? null;
    this.unidade_metrica = data.unidade_metrica ?? "m";
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
    this.linhas_preco = data.linhas_preco?.map((linha) => ({
      ...linha,
      valor: Number(linha.valor),
      preco: Number(linha.preco),
    }));
    this.preco_exibicao = data.preco_exibicao ?? null;
  }

  get isPrecoPorMetrica(): boolean {
    return this.tipo_preco === "POR_METRICA";
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
    const response = await api.post<ProdutoDTO>("/produtos", this.toPayload());
    const created = new Produto(response.data);
    Object.assign(this, created);
    return this;
  }

  async update(): Promise<Produto> {
    const response = await api.put<ProdutoDTO>(
      `/produtos/${this.id}`,
      this.toPayload()
    );
    const updated = new Produto(response.data);
    Object.assign(this, updated);
    return this;
  }

  async saveLinhasPreco(linhas: LinhaPrecoInput[]): Promise<void> {
    await LinhaPreco.replaceAllByProductId(this.id, linhas);
  }

  private toPayload(): ProdutoPayload {
    return {
      nome: this.nome,
      descricao: this.descricao,
      preco: this.isPrecoPorMetrica ? null : this.preco ?? null,
      tipo_preco: this.tipo_preco,
      metrica: this.isPrecoPorMetrica ? this.metrica : null,
      unidade_metrica: this.isPrecoPorMetrica ? this.unidade_metrica : null,
      marca: this.marca,
      imagem: this.imagem,
      estoque: this.estoque,
      categoria_id: this.categoria_id,
      subcategoria_id: this.subcategoria_id ?? null,
    };
  }

  async delete(): Promise<void> {
    await api.delete(`/produtos/${this.id}`);
  }
}
