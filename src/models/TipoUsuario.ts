
import { api } from "../api";
import { PermissaoTipoUsuarioDTO } from "./PermissaoTipoUsuario";

export interface TipoUsuarioDTO {
  id: number;
  tipo: string;
  permissoes: PermissaoTipoUsuarioDTO[];
}

export class TipoUsuario {
  id: number;
  tipo: string;
  permissoes: PermissaoTipoUsuarioDTO[];

  constructor(data: TipoUsuarioDTO) {
    this.id = data.id;
    this.tipo = data.tipo;
    this.permissoes = data.permissoes;
  }

  static async getAll(): Promise<TipoUsuario[]> {
    const response = await api.get<TipoUsuarioDTO[]>('/tipos_usuarios');
    return response.data.map(tipoUsuario => new TipoUsuario(tipoUsuario));
  }

  static async getById(id: number): Promise<TipoUsuario> {
    const response = await api.get<TipoUsuarioDTO>(`/tipos_usuarios/${id}`);
    return new TipoUsuario(response.data);
  }

  async create(): Promise<TipoUsuario> {
    const response = await api.post<TipoUsuarioDTO>('/tipos_usuarios', {
      tipo: this.tipo
    });
    this.id = response.data.id;
    return this;
  }

  async update(): Promise<TipoUsuario> {
    const response = await api.put<TipoUsuarioDTO>(`/tipos_usuarios/${this.id}`, {
      tipo: this.tipo
    });
    return new TipoUsuario(response.data);
  }

  async delete(): Promise<void> {
    await api.delete(`/tipos_usuarios/${this.id}`);
  }
}
