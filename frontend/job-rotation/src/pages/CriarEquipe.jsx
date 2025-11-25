import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; 

const API = import.meta.env.VITE_BACKEND_API;

function Navbar({ onLogout }) {
    const navigate = useNavigate();

    const handleProfile = () => {
        navigate('/perfil');
    };

    const handleLogout = () => {
        if (onLogout) {
            onLogout();
        } else {
            console.error('onLogout não foi fornecido ao Navbar.');
        }
    };
    
    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-white shadow-md">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <div 
                        className="flex-shrink-0 cursor-pointer" 
                        onClick={() => navigate('/')}
                    >
                        <span className="text-2xl font-bold text-purple-600 hover:text-purple-800 transition">
                            Job Rotation
                        </span>
                    </div>
                    <div className="flex items-center space-x-4">
                        <button
                            onClick={handleProfile}
                            className="p-2 rounded-full text-gray-400 hover:text-purple-600 cursor-pointer"
                            aria-label="Perfil do Usuário"
                            title="Perfil"
                        >
                            <svg 
                                xmlns="http://www.w3.org/2000/svg" 
                                className="h-6 w-6" 
                                fill="none" 
                                viewBox="0 0 24 24" 
                                stroke="currentColor" 
                                strokeWidth={2}
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </button>
                        <button
                            onClick={handleLogout}
                            className="px-3 py-1.5 text-sm font-medium rounded-lg text-white bg-red-500 
                            hover:bg-red-600 cursor-pointer"
                            title="Sair da Aplicação"
                        >
                            Sair
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
}

function UnderlineInput({ id, label, type = 'text', value, onChange, placeholder }) {
    return (
        <div className="mb-6">
            <label htmlFor={id} className="block text-sm text-slate-950 mb-1 font-semibold">{label}</label>
            <input
                id={id}
                type={type}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                className="w-full bg-transparent border-0 border-b border-gray-300 focus:border-b-2 focus:border-purple-600 outline-none py-2 placeholder:text-gray-400 text-gray-700 transition-colors"
            />
        </div>
    );
}

function ButtonBack() {
    const navigate = useNavigate();
    return (
        <button
            onClick={() => navigate(-1)}
            className="absolute top-4 left-4 p-2 rounded-full text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition"
            aria-label="Voltar para a página anterior"
            title="Voltar"
        >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
        </button>
    );
}

export default function CriarEquipe() {
    const navigate = useNavigate();
    const [nome, setNome] = useState('');
    const [descricao, setDescricao] = useState('');
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');
    const [successMsg, setSuccessMsg] = useState('');
    
    const token = localStorage.getItem('token');
    
    const onLogout = useCallback(() => {
        localStorage.removeItem('token');
        navigate('/login', { replace: true });
    }, [navigate]);

    useEffect(() => {
        if (!token) {
            console.warn('CriarEquipe: Token não encontrado. Redirecionando para login.');
            navigate('/login', { replace: true });
        }
    }, [token, navigate]);

    if (!token) {
        return <div className="p-10 text-center text-red-500">Acesso negado. Redirecionando...</div>; 
    }
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMsg('');
        setSuccessMsg('');

        if (!nome) {
            setErrorMsg('O nome da equipe é obrigatório.');
            return;
        }

        setLoading(true);
        try {
            const url = `${API}/equipes/criar`; 
            console.log('POST ->', url, { nome, descricao });

            const payload = descricao ? { nome, descricao } : { nome };

            const res = await axios.post(url, payload, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            console.log('Equipe criada com sucesso:', res.data);
            setSuccessMsg(`Equipe "${res.data.nome}" criada com sucesso! Redirecionando...`);
            
            setTimeout(() => {
                navigate('/', { replace: true });
            }, 1500);

        } catch (err) {
            console.error('Erro ao criar equipe (axios):', err);
            const status = err.response?.status;

            if (status === 401) {
                setErrorMsg('Sua sessão expirou (401 Não Autorizado). Por favor, faça login novamente.');
                onLogout();
            } else if (err.response) {
                const serverMessage = err.response?.data?.mensagem || err.response?.data?.message;
                const statusMessage = status ? ` (Status ${status})` : '';
                
                if (serverMessage) {
                    setErrorMsg(`Erro do Servidor${statusMessage}: ${serverMessage}`);
                } else {
                    setErrorMsg(`Erro desconhecido do Servidor${statusMessage}. Verifique o console para mais detalhes.`);
                }
                
            } else if (err.request) {
                setErrorMsg(`Erro de Conexão: O servidor em ${API} não respondeu. Verifique se o endereço da API está correto e se o servidor está ativo.`);
            } else {
                setErrorMsg('Erro ao tentar conectar: ' + err.message);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col pt-16">
            <Navbar onLogout={onLogout} />

            <div className="flex flex-1 items-center justify-center p-4 sm:p-6 lg:p-8">
                <div className="w-full max-w-md">
                    <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-xl overflow-hidden relative">
                        <ButtonBack />
                        <div className="px-6 pt-8 pb-4 border-b border-gray-100">
                            <h1 className="text-center text-2xl font-extrabold text-slate-950 flex items-center justify-center space-x-2">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354l.794.794a1 1 0 001.414 0l.794-.794a8 8 0 11-3.794 3.794zm-1.794 6.75l-4.5 4.5M10.5 12h3M12 10.5v3" />
                                </svg>
                                <span>Criar Nova Equipe</span>
                            </h1>
                            <p className="text-center text-sm text-gray-500 mt-2">
                                O seu usuário será o primeiro membro desta equipe.
                            </p>
                        </div>
                        
                        <div className="p-6">
                            <form onSubmit={handleSubmit} className="pt-2">
                                <UnderlineInput 
                                    id="nome" 
                                    label="Nome da Equipe" 
                                    value={nome} 
                                    onChange={(e) => setNome(e.target.value)} 
                                    placeholder="Nome único para a equipe" 
                                />
                                <div className="mb-6">
                                    <label htmlFor="descricao" className="block text-sm text-slate-950 mb-1 font-semibold">Descrição (Opcional)</label>
                                    <textarea
                                        id="descricao"
                                        value={descricao}
                                        onChange={(e) => setDescricao(e.target.value)}
                                        placeholder="Breve descrição dos objetivos da equipe"
                                        rows="3"
                                        className="w-full bg-transparent border-0 border-b border-gray-300 focus:border-b-2 focus:border-purple-600 outline-none py-2 placeholder:text-gray-400 text-gray-700 resize-none transition-colors"
                                    />
                                </div>


                                {errorMsg && (
                                    <div className="text-center text-sm text-red-600 mb-4 p-2 bg-red-100 rounded-lg border border-red-200">
                                        {errorMsg}
                                    </div>
                                )}
                                
                                {successMsg && (
                                    <div className="text-center text-sm text-green-600 mb-4 p-2 bg-green-100 rounded-lg border border-green-200">
                                        {successMsg}
                                    </div>
                                )}

                                <button 
                                    type="submit" 
                                    disabled={loading || !!successMsg} 
                                    className="w-full bg-purple-600 text-white py-4 rounded-full font-semibold text-lg shadow-lg hover:bg-purple-700 cursor-pointer transition disabled:opacity-60 disabled:cursor-not-allowed"
                                >
                                    {loading ? 'Criando Equipe...' : 'Criar Equipe'}
                                </button>
                                
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}