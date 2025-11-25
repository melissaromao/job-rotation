import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
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

function Menu() { 
    const navigate = useNavigate();
    
    const token = localStorage.getItem('token'); 
    
    const onLogout = useCallback(() => {
        localStorage.removeItem('token');
        console.log('Logout executado no Menu. Redirecionando...');
        navigate('/login', { replace: true });
    }, [navigate]);

    const [equipes, setEquipes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    useEffect(() => {
        if (!token) {
            console.warn('Menu: Token não encontrado. Redirecionando para login.');
            navigate('/login', { replace: true });
        }
    }, [token, navigate]);
    
    if (!token) {
        return <div className="p-10 text-center text-red-500">Acesso negado. Redirecionando...</div>; 
    }


    const buscarEquipes = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            const url = `${API}/equipes/listar`;
            console.log('GET ->', url);

            const response = await axios.get(url, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            setEquipes(response.data); 

        } catch (err) {
            console.error("Erro ao buscar equipes:", err);
            
            if (axios.isAxiosError(err) || (err.message && err.message.includes('401'))) {
                onLogout(); 
                setError("Sessão expirada. Redirecionando para login.");
            } else {
                setError("Erro ao carregar equipas. Verifique a consola.");
            }

        } finally {
            setLoading(false);
        }
    }, [token, onLogout]); 

    useEffect(() => {
        if (token) {
            buscarEquipes();
        }
    }, [buscarEquipes, token]);

    const handleCriarEquipe = () => {
        navigate('/criar-equipe'); 
    };
    
    const handleEntrarEquipe = () => {
        navigate('/entrar-equipe');
    };

    const handleSelecionarEquipe = (equipeId) => {
        navigate(`/equipes/${equipeId}`);
    };
    
    return (
        <div className="min-h-screen bg-gray-50 overflow-x-hidden">
            <Navbar 
                onLogout={onLogout} 
            />

            <div className="relative z-10 mt-20 pt-24 p-4 sm:p-6 max-w-4xl mx-auto pb-24">
                
                <div className="relative w-28 h-28 mx-auto mb-8 border-4 border-white shadow-lg rounded-full bg-purple-600 flex items-center justify-center text-white">
                    <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        className="h-14 w-14" 
                        fill="none" 
                        viewBox="0 0 24 24" 
                        stroke="currentColor" 
                        strokeWidth={1.5}
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                </div>

                <h1 className="text-3xl font-extrabold text-gray-900 text-center">
                    Job Rotation
                </h1>
                <p className="text-lg font-semibold text-gray-600 mt-1 mb-12 text-center">
                    Movimentando equipes, capacitando pessoas.
                </p>

                <h2 className="text-2xl font-bold text-gray-800 mb-6 text-left border-b-2 border-gray-200 pb-2">
                    Minhas Equipes
                </h2>

                {loading ? (
                    <div className="flex items-center justify-center h-48 text-gray-600">
                        Carregando equipes...
                    </div>
                ) : error ? (
                    <p className="text-red-600 mb-4 p-4 bg-red-100 rounded-xl border border-red-200 shadow-md text-left font-medium">
                        {error}
                    </p>
                ) : equipes.length === 0 ? (
                    <div className="p-10 text-center rounded-xl">
                        <p className="text-lg text-gray-600 font-medium">
                            Nenhuma equipe por aqui...
                        </p>
                        <p className="text-sm text-gray-500 mt-2">
                            Crie ou entre em uma equipe para começar.
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                        {equipes.map((equipe) => (
                            <div
                                key={equipe._id}
                                className="flex flex-col items-center justify-start text-center cursor-pointer 
                                transition-transform duration-200 p-3 rounded-xl bg-white shadow-lg border border-gray-100 
                                hover:shadow-xl hover:border-indigo-400"
                                onClick={() => handleSelecionarEquipe(equipe._id)}
                            >
                                <div className="w-16 h-16 sm:w-16 sm:h-16 bg-indigo-500 rounded-full 
                                    flex items-center justify-center shadow-lg mb-2">
                                    <span className="text-white text-xl font-bold">
                                        {equipe.nome ? equipe.nome[0].toUpperCase() : 'E'}
                                    </span>
                                </div>
                                <p className="text-sm text-gray-800 font-medium truncate w-full px-1" title={equipe.nome}>
                                    {equipe.nome || 'Nome da Equipe'}
                                </p>
                                <p className="text-xs text-gray-500 mt-0.5">
                                    {equipe.membros?.length || 0} Membros
                                </p>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div className="fixed bottom-8 right-8 flex flex-col items-end space-y-4 z-20">
                <div className="group relative">
                    <button
                        onClick={handleEntrarEquipe} 
                        className="w-16 h-16 bg-green-400 rounded-full 
                        flex items-center justify-center text-white 
                        text-3xl shadow-xl hover:bg-green-500 transition-all 
                        transform hover:scale-110 cursor-pointer"
                        aria-label="Entrar em Equipe Existente"
                        title="Entrar em Equipe Existente"
                    >
                        <svg 
                            xmlns="http://www.w3.org/2000/svg" 
                            className="h-8 w-8 text-white" 
                            fill="none" 
                            viewBox="0 0 24 24" 
                            stroke="currentColor" 
                            strokeWidth={2}
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M13 9l3 3m0 0l-3 3m3-3H8m13 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </button>
                    <span className="absolute right-full top-1/2 transform -translate-y-1/2 mr-3 px-3 py-1 bg-gray-800 text-white text-sm rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none hidden sm:block">
                        Entrar em Equipe
                    </span>
                </div>
                
                <div className="group relative">
                    <button
                        onClick={handleCriarEquipe} 
                        className="w-16 h-16 bg-green-500 rounded-full 
                        flex items-center justify-center text-white 
                        text-3xl shadow-2xl hover:bg-green-600 transition-all 
                        transform hover:scale-110 cursor-pointer"
                        aria-label="Criar Nova Equipe"
                        title="Criar Nova Equipe"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-8 w-8"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2}
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                    </button>
                    <span className="absolute right-full top-1/2 transform -translate-y-1/2 mr-3 px-3 py-1 bg-gray-800 text-white text-sm rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none hidden sm:block">
                        Criar Nova Equipe
                    </span>
                </div>
            </div>
        </div>
    );
}

export default Menu;