
import { Http2ServerResponse } from "http2";
import { api } from "../api";
import { TipoUsuario, TipoUsuarioDTO } from "./TipoUsuario";

export interface UsuarioDTO {
  id: number;
  nome: string;
  email: string;
  senha?: string;
  tipo_usuario_id: number;
  created_at?: string;
  updated_at?: string;
  tipo_usuario?: TipoUsuarioDTO;
}

export class Usuario {
  id: number;
  nome: string;
  email: string;
  senha?: string;
  tipo_usuario_id: number;
  created_at?: Date;
  updated_at?: Date;
  tipo_usuario?: TipoUsuario;

  constructor(data: UsuarioDTO) {
    this.id = data.id;
    this.nome = data.nome;
    this.email = data.email;
    this.senha = data.senha;
    this.tipo_usuario_id = data.tipo_usuario_id;
    this.created_at = data.created_at ? new Date(data.created_at) : undefined;
    this.updated_at = data.updated_at ? new Date(data.updated_at) : undefined;
    this.tipo_usuario = data.tipo_usuario
      ? new TipoUsuario(data.tipo_usuario)
      : undefined;
  }

  static async getAll(): Promise<Usuario[]> {
    const response = await api.get<UsuarioDTO[]>("/usuarios");
    return response.data.map((usuario) => new Usuario(usuario));
  }

  static async getById(id: number): Promise<Usuario> {
    console.log('getById')
    const response = await api.get<UsuarioDTO>(`/usuarios/${id}`);
    return new Usuario(response.data);
  }

  async signUp(): Promise<Usuario> {
    const response = await api.post<UsuarioDTO>("/usuarios", {
      nome: this.nome,
      email: this.email,
      senha: this.senha,
      tipo_usuario_id: this.tipo_usuario_id,
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

  async create(): Promise<Usuario> {
    const response = await api.post<UsuarioDTO>("/usuarios", {
      nome: this.nome,
      email: this.email,
      senha: this.senha,
      tipo_usuario_id: this.tipo_usuario_id,
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

  async update(): Promise<Usuario> {
    const response = await api.put<UsuarioDTO>(`/usuarios/${this.id}`, {
      nome: this.nome,
      email: this.email,
      senha: this.senha,
      tipo_usuario_id: this.tipo_usuario_id,
    });
    this.updated_at = response.data.updated_at
      ? new Date(response.data.updated_at)
      : new Date();
    return this;
  }

  async delete(): Promise<void> {
    await api.delete(`/usuarios/${this.id}`);
  }

  static async login(
    email: string,
    senha: string
  ): Promise<{ token: string; usuario: Usuario }> {
    const response = await api.post<{ token: string; usuario: UsuarioDTO }>(
      "/usuarios/login",
      {
        email,
        senha,
      }
    );
    return {
      token: response.data.token,
      usuario: new Usuario(response.data.usuario),
    };
  }

  static sendPasswordReset( email: string): Promise<Response> {
    return api.post("/usuarios/reset-password", {
      email
    });
  };

  hasPermission(permission: string): boolean {
    console.log("hasPermission");
    return this.tipo_usuario.permissoes.some(
      (permissao) => permissao.permissao === permission
    );
  }
}
