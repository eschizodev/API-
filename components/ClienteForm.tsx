'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { z } from 'zod';
import React from 'react';

const clienteSchema = z.object({
  nome: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres').max(100, 'Nome deve ter no máximo 100 caracteres'),
  email: z.string().email('Email inválido'),
  senha: z.string().min(8, 'Senha deve ter pelo menos 8 caracteres').max(100, 'Senha deve ter no máximo 100 caracteres'),
})

export default function ClienteForm() {
  const [formData, setFormData] = useState({ nome: '', email: '', senha: '' })
  
  // Tipo de erros atualizado
  const [errors, setErrors] = useState<{ [key: string]: string | string[] }>({})
  
  const router = useRouter()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrors({})
    try {
        clienteSchema.parse(formData)
      
        const response = await fetch('/api/clientes', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
          credentials: 'include',
        })
      
        if (!response.ok) {
          const data = await response.json()
          throw new Error(data.error || 'Erro ao cadastrar cliente')
        }
      
        router.push('/sucesso')
      } catch (err) {
        if (err instanceof z.ZodError) {
          // Filtrando os erros undefined e mantendo apenas erros válidos
          const flattenErrors = err.flatten().fieldErrors
          const filteredErrors = Object.fromEntries(
            Object.entries(flattenErrors).map(([key, value]) => [
              key,
              value ? value : [] // Se o valor for undefined, converta para um array vazio
            ])
          )
          setErrors(filteredErrors)
        } else if (err instanceof Error) {
          setErrors({ form: err.message })
        }
      }
      
      
    }
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="nome" className="block text-sm font-medium text-gray-700">Nome</label>
        <input
          type="text"
          id="nome"
          name="nome"
          value={formData.nome}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        />
        {Array.isArray(errors.nome) ? errors.nome.map((error, index) => (
          <p key={index} className="text-red-500 text-xs mt-1">{error}</p>
        )) : errors.nome && <p className="text-red-500 text-xs mt-1">{errors.nome}</p>}
      </div>
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        />
        {Array.isArray(errors.email) ? errors.email.map((error, index) => (
          <p key={index} className="text-red-500 text-xs mt-1">{error}</p>
        )) : errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
      </div>
      <div>
        <label htmlFor="senha" className="block text-sm font-medium text-gray-700">Senha</label>
        <input
          type="password"
          id="senha"
          name="senha"
          value={formData.senha}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        />
        {Array.isArray(errors.senha) ? errors.senha.map((error, index) => (
          <p key={index} className="text-red-500 text-xs mt-1">{error}</p>
        )) : errors.senha && <p className="text-red-500 text-xs mt-1">{errors.senha}</p>}
      </div>
      {errors.form && <p className="text-red-500">{errors.form}</p>}
      <button type="submit" className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
        Cadastrar
      </button>
    </form>
  )
}
