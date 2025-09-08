import { api } from "../api";
import { TipoUsuario, TipoUsuarioDTO } from "./TipoUsuario";

export interface PermissaoTipoUsuarioDTO {
  id: number;
  tipo_usuario_id: number;
  permissao: string;
  descricao?: string;
  created_at?: string;
  updated_at?: string;
  tipo_usuario?: TipoUsuarioDTO;
}

export class PermissaoTipoUsuario {
  id: number;
  tipo_usuario_id: number;
  permissao: string;
  descricao?: string;
  created_at?: Date;
  updated_at?: Date;
  tipo_usuario?: TipoUsuario;

  constructor(data: PermissaoTipoUsuarioDTO) {
    this.id = data.id;
    this.tipo_usuario_id = data.tipo_usuario_id;
    this.permissao = data.permissao;
    this.descricao = data.descricao;
    this.created_at = data.created_at ? new Date(data.created_at) : undefined;
    this.updated_at = data.updated_at ? new Date(data.updated_at) : undefined;
    this.tipo_usuario = data.tipo_usuario
      ? new TipoUsuario(data.tipo_usuario)
      : undefined;
  }

  static async getAll(): Promise<PermissaoTipoUsuario[]> {
    const response = await api.get<PermissaoTipoUsuarioDTO[]>(
      "/permissoes-tipos-usuarios"
    );
    return response.data.map(
      (permissao) => new PermissaoTipoUsuario(permissao)
    );
  }

  static async getById(id: number): Promise<PermissaoTipoUsuario> {
    const response = await api.get<PermissaoTipoUsuarioDTO>(
      `/permissoes-tipos-usuarios/${id}`
    );
    return new PermissaoTipoUsuario(response.data);
  }

  async create(): Promise<PermissaoTipoUsuario> {
    const response = await api.post<PermissaoTipoUsuarioDTO>(
      "/permissoes-tipos-usuarios",
      {
        tipo_usuario_id: this.tipo_usuario_id,
        permissao: this.permissao,
        descricao: this.descricao,
      }
    );
    this.id = response.data.id;
    this.created_at = response.data.created_at
      ? new Date(response.data.created_at)
      : new Date();
    this.updated_at = response.data.updated_at
      ? new Date(response.data.updated_at)
      : new Date();
    return this;
  }

  async update(): Promise<PermissaoTipoUsuario> {
    const response = await api.put<PermissaoTipoUsuarioDTO>(
      `/permissoes-tipos-usuarios/${this.id}`,
      {
        tipo_usuario_id: this.tipo_usuario_id,
        permissao: this.permissao,
        descricao: this.descricao,
      }
    );
    this.updated_at = response.data.updated_at
      ? new Date(response.data.updated_at)
      : new Date();
    return this;
  }

  async delete(): Promise<void> {
    await api.delete(`/permissoes-tipos-usuarios/${this.id}`);
  }
}
