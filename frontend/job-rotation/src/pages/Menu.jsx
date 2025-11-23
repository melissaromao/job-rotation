import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
const API = import.meta.env.VITE_BACKEND_API;

function Menu() {
    const [equipes, setEquipes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const buscarEquipes = async () => {
            const token = localStorage.getItem('token');

            if (!token) {
                navigate('/login');
                return;
            }

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
                setError("Não foi possível carregar as equipes. Tente novamente.");
            } finally {
                setLoading(false);
            }
        };

        buscarEquipes();
    }, [navigate]);

    const handleCriarEquipe = () => {
        navigate('/criar-equipe');
    };

    if (loading) {
        return (
            <div className="h-screen flex items-center justify-center text-gray-500">
                Carregando equipes...
            </div>
        );
    }

    return (
        <div className="min-h-screen p-6 bg-gray-50">
            <h1 className="text-3xl font-bold text-gray-800 mb-8">Meu Menu de Equipes</h1>

            {error && <p className="text-red-500 mb-4">{error}</p>}

            {equipes.length === 0 ? (
                <div className="mt-10 p-8 text-center bg-white rounded-xl shadow-lg">
                    <p className="text-xl text-gray-600 font-medium mb-6">
                        Nenhuma equipe por aqui
                    </p>
                    <button
                        onClick={handleCriarEquipe}
                        className="bg-purple-600 text-white py-3 px-6 rounded-lg 
                       font-semibold text-lg hover:bg-purple-700 
                       transition-colors duration-200 shadow-md"
                    >
                        Criar Equipe Agora!
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {equipes.map((equipe) => (
                        <div
                            key={equipe._id}
                            className="bg-white p-6 rounded-xl shadow-lg cursor-pointer hover:shadow-xl transition-shadow"
                            onClick={() => navigate(`/equipes/${equipe._id}`)}
                        >
                            <h2 className="text-xl font-bold text-indigo-700">{equipe.nome}</h2>
                            <p className="text-sm text-gray-500 mt-2">{equipe.descricao || 'Sem descrição.'}</p>
                            <p className="text-xs text-gray-400 mt-4">{equipe.membros.length} Membros</p>
                        </div>
                    ))}

                    <button
                        onClick={handleCriarEquipe}
                        className="flex items-center justify-center p-6 border-2 border-dashed border-gray-300 rounded-xl text-gray-500 hover:border-purple-400 hover:text-purple-600 transition-colors"
                    >
                        + Adicionar Nova Equipe
                    </button>

                </div>
            )}
        </div>
    );
}

export default Menu;