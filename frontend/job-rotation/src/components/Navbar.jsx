import React from 'react';
import { useNavigate } from 'react-router-dom';

function Navbar() { 
    const navigate = useNavigate();

    const handleProfile = () => {
        navigate('/perfil');
    };

    const handleLogout = () => {
        
        try {
            console.log('--- INÍCIO: Executando handleLogout ---');

            const currentToken = localStorage.getItem('token');
            console.log('Valor do token (antes da remoção):', currentToken ? 'EXISTE' : 'NÃO EXISTE');
            
            localStorage.removeItem('token');
            
            const tokenAfterRemoval = localStorage.getItem('token');
            console.log('Token após remoção:', tokenAfterRemoval);

            navigate('/login'); 
            
            console.log('--- FIM: Redirecionando para /login. ---');

        } catch (error) {
            console.error('ERRO FATAL DURANTE LOGOUT:', error);
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

export default Navbar;