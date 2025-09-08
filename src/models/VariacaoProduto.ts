import { api } from "../api";

export interface VariacaoProdutoDTO {
    id: number;
    nome: string;
    descricao: string;
    produto_id: number;
    created_at: string;
    updated_at: string;
}
export class VariacaoProduto {
    id: number;
    nome: string;
    descricao: string;
    produto_id: number;
    created_at: Date;
    updated_at: Date;

    constructor(data: VariacaoProdutoDTO) {
        this.id = data.id;
        this.nome = data.nome;
        this.descricao = data.descricao;
        this.produto_id = data.produto_id;
        this.created_at = new Date(data.created_at);
        this.updated_at = new Date(data.updated_at);
    }

    static async getAll(): Promise<VariacaoProduto[]> {
        const response = await api.get<VariacaoProdutoDTO[]>('/variacoes-produto');
        return response.data.map(item => new VariacaoProduto(item));
    }

    static async getById(id: number): Promise<VariacaoProduto> {
        const response = await api.get<VariacaoProdutoDTO>(`/variacoes-produto/${id}`);
        return new VariacaoProduto(response.data);
    }

    static async getByProdutoId(produto_id: number): Promise<VariacaoProdutoDTO[]> {
        const response = await api.get<VariacaoProdutoDTO[]>(`/variacoes-produto/produto/${produto_id}`);
        return response.data;
    }

    async create(): Promise<VariacaoProdutoDTO> {
        const response = await api.post<VariacaoProdutoDTO>('/variacoes-produto', {
            nome: this.nome,
            descricao: this.descricao,
            produto_id: this.produto_id
        });
        this.id = response.data.id;
        this.created_at = new Date(response.data.created_at);
        this.updated_at = new Date(response.data.updated_at);
        return response.data;
    }

   static async createManyByProductId(produto_id: number, variacoes: VariacaoProdutoDTO[]): Promise<VariacaoProdutoDTO[]> {
            const response = await api.post(`/variacoes-produto/produto/${produto_id}`, variacoes);
            return response.data;
    
    }

    async update(): Promise<VariacaoProdutoDTO> {
        const response = await api.put<VariacaoProdutoDTO>(`/variacoes-produto/${this.id}`, {
            nome: this.nome,
            descricao: this.descricao,
            produto_id: this.produto_id
        });
        this.updated_at = new Date(response.data.updated_at);
        return response.data;
    }

    async delete(): Promise<void> {
        await api.delete(`/variacoes-produto/${this.id}`);
    }
}
