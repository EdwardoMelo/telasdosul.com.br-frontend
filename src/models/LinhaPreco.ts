import { api } from "../api";

export interface LinhaPrecoDTO {
  id: number;
  produto_id: number;
  valor: number;
  preco: number;
  rotulo?: string | null;
  ordem: number;
  ativo: boolean;
  rotulo_exibicao?: string;
  created_at?: string;
  updated_at?: string;
}

export interface LinhaPrecoInput {
  valor: number;
  preco: number;
  rotulo?: string | null;
  ordem?: number;
  ativo?: boolean;
}

export type TipoPrecoProduto = "FIXO" | "POR_METRICA";

export interface PrecoExibicao {
  tipo: "fixo" | "faixa";
  valor?: number;
  min?: number;
  max?: number;
}

export class LinhaPreco {
  static async replaceAllByProductId(
    produtoId: number,
    linhas: LinhaPrecoInput[]
  ): Promise<LinhaPrecoDTO[]> {
    const response = await api.post<LinhaPrecoDTO[]>(
      `/linhas-preco/produto/${produtoId}`,
      { linhas }
    );
    return response.data;
  }

  static async getByProductId(produtoId: number): Promise<LinhaPrecoDTO[]> {
    const response = await api.get<LinhaPrecoDTO[]>(
      `/linhas-preco/produto/${produtoId}`
    );
    return response.data;
  }
}
