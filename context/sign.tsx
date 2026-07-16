'use client'
import { useState, FormEvent } from "react"
import Image from "next/image";
import { Eye, EyeOff } from 'lucide-react';
import { useRouter } from 'next/navigation'
import { createClient } from "@/utils/supabase/client";

export default function RegisterPage() {
    const [showEyes, setShowEyes] = useState(false)
    const [showConfirmEyes, setShowConfirmEyes] = useState(false)
    const [loading, setLoading] = useState(false)
    const [errorMsg, setErrorMsg] = useState<string | null>(null)
    const redirect = useRouter()

    const togglePasswordVisibility = () => setShowEyes(!showEyes)
    const toggleConfirmPasswordVisibility = () => setShowConfirmEyes(!showConfirmEyes)

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault()
        setErrorMsg(null)
        setLoading(true)

        const email = (event.currentTarget.elements.namedItem('email') as HTMLInputElement).value
        const password = (event.currentTarget.elements.namedItem('password') as HTMLInputElement).value
        const confirmPassword = (event.currentTarget.elements.namedItem('confirmPassword') as HTMLInputElement).value

        console.log('--- Tentative d\'inscription ---')
        console.log('Email saisi :', email)
        console.log('Password saisi :', password ? '••••••• (rempli)' : '(vide)')
        console.log('Confirmation saisie :', confirmPassword ? '••••••• (rempli)' : '(vide)')

        if (password !== confirmPassword) {
            console.error('Erreur ❌ : les mots de passe ne correspondent pas')
            setErrorMsg('Les mots de passe ne correspondent pas.')
            setLoading(false)
            return
        }

        try {
            console.log('Appel à supabase.auth.signUp...')
            const { data, error } = await createClient().auth.signUp({
                email,
                password,
            })

            console.log('Réponse Supabase → data:', data)
            console.log('Réponse Supabase → error:', error)

            if (error) throw error

            console.log('Inscription réussie ✅ user:', data.user)
            console.log('session:', data.session)

            if (!data.session) {
                console.log('Aucune session retournée → confirmation par email probablement requise')
                setErrorMsg('Vérifie ta boîte mail pour confirmer ton compte.')
                setLoading(false)
                return
            }

            console.log('Soumis avec succès, redirection vers /dashboard...')
            redirect.push('/dashboard')
        } catch (error: any) {
            console.error('Erreur d\'inscription ❌ :', error)
            setErrorMsg(error?.message ?? 'Une erreur est survenue.')
        } finally {
            setLoading(false)
            console.log('--- Fin de la tentative ---')
        }
    }

    return (
        <div className="h-screen w-full flex items-center justify-center dark:bg-gray-50">
            <div className="flex h-full w-full">
                {/* Section Image */}
                <div className="hidden md:block md:w-1/2 relative h-full">
                    <Image
                        src="/images/login.webp"
                        alt="register"
                        fill
                        priority
                        className="object-cover"
                    />
                </div>

                {/* Section Formulaire */}
                <div className="w-full md:w-1/2 flex items-center justify-center p-8 lg:p-16">
                    <div className="w-full max-w-md">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="mb-4">
                                <h1 className="text-3xl font-bold text-gray-900 mb-2">Inscription</h1>
                                <p className="text-sm text-gray-500">Créez votre compte pour commencer.</p>
                            </div>

                            {errorMsg && (
                                <div className="rounded-lg bg-red-50 border border-red-200 p-3 text-sm text-red-600">
                                    {errorMsg}
                                </div>
                            )}

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
                                        minLength={6}
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

                            <div>
                                <label htmlFor="confirmPassword" className="text-sm font-medium text-gray-500 uppercase tracking-wider">Confirmer le mot de passe</label>
                                <div className="relative mt-1.5">
                                    <input
                                        type={showConfirmEyes ? 'text' : 'password'}
                                        id="confirmPassword"
                                        required
                                        minLength={6}
                                        placeholder="********"
                                        className="border text-gray-500 border-gray-300 p-3.5 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                    <button
                                        type="button"
                                        onClick={toggleConfirmPasswordVisibility}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-gray-500 hover:text-gray-700"
                                    >
                                        {showConfirmEyes ? <EyeOff /> : <Eye />}
                                    </button>
                                </div>
                            </div>

                            <div className="pt-2">
                                <button
                                    disabled={loading}
                                    type="submit"
                                    className="p-3.5 rounded-lg bg-orange-600 w-full text-white font-medium hover:bg-orange-700 transition-colors disabled:bg-orange-400"
                                >
                                    {loading ? 'Création en cours...' : "S'inscrire"}
                                </button>
                            </div>

                            <p className="text-sm text-gray-500 text-center">
                                Déjà un compte ?{' '}
                                <a href="/auth" className="text-orange-600 font-medium hover:underline">
                                    Se connecter
                                </a>
                            </p>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}