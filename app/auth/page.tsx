'use client'
import { useState, FormEvent } from "react"
import Image from "next/image";
import { Eye, EyeOff } from 'lucide-react';
import { useRouter } from 'next/navigation'
import { createClient } from "@/utils/supabase/client";
export default function LoginPage() {
    const [showEyes, setShowEyes] = useState(false)
    const [loading, setLoading] = useState(false)
    const redirect = useRouter()
    const togglePasswordVisibility = () => {
        setShowEyes(!showEyes)
    }

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault()
        setLoading(true)

        const email = (event.currentTarget.elements.namedItem('email') as HTMLInputElement).value
        const password = (event.currentTarget.elements.namedItem('password') as HTMLInputElement).value

        console.log('--- Tentative de connexion ---')
        console.log('Email saisi :', email)
        console.log('Password saisi :', password ? '••••••• (rempli)' : '(vide)')

        try {
            console.log('Appel à supabase.auth.signInWithPassword...')
            const { data, error } = await createClient().auth.signInWithPassword({
                email,
                password,
            })

            console.log('Réponse Supabase → data:', data)
            console.log('Réponse Supabase → error:', error)

            if (error) throw error

            console.log('Connexion réussie ✅ user:', data.user)
            console.log('session:', data.session)

            await new Promise((resolve) => setTimeout(resolve, 2000))
            console.log('Soumis avec succès, redirection vers /dashboard...')
            redirect.push('/dashboard')
        } catch (error) {
            console.error('Erreur de connexion ❌ :', error)
        } finally {
            setLoading(false)
            console.log('--- Fin de la tentative ---')
        }
    }

    return (
        <div className="h-screen w-full flex items-center justify-center dark:bg-gray-50">
            <div className="flex h-full w-full">
                 {/* Section Image : S'adapte parfaitement à l'écran (Masquée sur mobile pour UX) */}
                <div className="hidden md:block md:w-1/2 relative h-full">
                    <Image 
                        src="/images/login.webp"
                        alt="login"
                        fill
                        priority
                        className="object-cover"
                    />
                </div>

                {/* Section Formulaire : Centrée horizontalement et verticalement */}
                <div className="w-full md:w-1/2 flex items-center justify-center p-8 lg:p-16">
                    <div className="w-full max-w-md">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="mb-4">
                                <h1 className="text-3xl font-bold text-gray-900 mb-2">Connexion</h1>
                                <p className="text-sm text-gray-500">Veuillez vous connecter à votre compte.</p>
                            </div>

                            <div>
                                <label htmlFor="email" className="text-sm font-medium text-gray-500 uppercase tracking-wider">Email</label>
                                <div className="mt-1.5">
                                    <input 
                                        type="email" 
                                        id="email" 
                                        required
                                        placeholder="dohfawaz90@gmail.com" 
                                        className="border border-gray-300 p-3.5 w-full text-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                                    />
                                </div>
                            </div>

                            <div>
                                <label htmlFor="password" className="text-sm font-medium text-gray-500 uppercase tracking-wider">Mot de passe</label>
                                <div className="relative mt-1.5">
                                    <input 
                                        type={showEyes ? 'text' : 'password'} 
                                        id="password" 
                                        required
                                        placeholder="********" 
                                        className="border text-gray-500 border-gray-300 p-3.5 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                                    />
                                    <button 
                                        type="button" 
                                        onClick={togglePasswordVisibility} 
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-gray-500 hover:text-gray-700"
                                    >
                                        {showEyes ? <EyeOff /> : <Eye />}
                                    </button>
                                </div>
                            </div>

                            <div className="pt-2">
                                <button 
                                    disabled={loading} 
                                    type="submit" 
                                    className="p-3.5 rounded-lg bg-orange-600 w-full text-white font-medium hover:bg-orange-700 transition-colors disabled:bg-orange-400"
                                >
                                    {loading ? 'Envoi en cours...' : 'Se connecter'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>

               

            </div>
        </div>
    )
}