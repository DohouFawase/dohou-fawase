import { Mail, PhoneCall, BadgeCheck } from 'lucide-react';

export default function ContactPage() {
    return (
        <>
            <div className=" h-screen w-full flex items-center justify-center dark:bg-gray-50 dark:text-black ">
                <div className="flex flex-col items-center justify-center  ">
                    <h1 className="text-4xl font-bold mb-4">Contactez-nous</h1>
                    <p className='w-1/3 text-center'>Nous serions ravis de vous entendre ! Veuillez remplir le formulaire ci-dessous pour nous envoyer un message.</p>
                    <div className="">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-24 mt-8 items-center">
                            <div className="">
                                <form>
                                    <div className=" space-y-2.5">
                                        <div className="grid grid-cols-1 md:grid-cols-2 space-y-2.5 gap-8 ">
                                            <div className="">
                                                <label htmlFor="name">Nom</label>
                                                <input type="text" id="name" name="name" required
                                                    className="border border-gray-300 p-3.5 w-full text-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                />
                                            </div>
                                            <div className="">
                                                <label htmlFor="firstname">Prenom</label>
                                                <input type="text" id="firstname" name="firstname" required
                                                    className="border border-gray-300 p-3.5 w-full text-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                />
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                            <div className="">
                                                <label htmlFor="email">Email</label>
                                                <input type="email" id="email" name="email" required
                                                    className="border border-gray-300 p-3.5 w-full text-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                />
                                            </div>
                                            <div className="">
                                                <label htmlFor="subject">Sujet de la demande</label>
                                                <input type="text" id="subject" name="subject" required
                                                    className="border border-gray-300 p-3.5 w-full text-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                />
                                            </div>
                                        </div>

                                        <div className="">

                                            <div className="">
                                                <label htmlFor="message">Message</label>
                                                <textarea id="message" name="message" rows={4} required
                                                    className="border border-gray-300 p-3.5 w-full text-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                ></textarea>
                                            </div>
                                        </div>
                                        <div className="py-2">
                                            <button type="submit"
                                                className="p-3.5 rounded-lg bg-blue-600 w-full text-white font-medium hover:bg-blue-500 transition-colors disabled:bg-blue-400"
                                            >Envoyer</button>
                                        </div>
                                    </div>
                                </form>


                            </div>
                            <div className="">
                                <div className=""></div>

                                <div className="">
                                    <ul className="space-y-4">
                                        <li className="flex items-center gap-1.5">
                                            <BadgeCheck size={20} className='text-blue-600' />
                                            <span>Conception d&apos;architectures sur-mesure, robustes et évolutives pour tes projets</span>
                                        </li>

                                        <li className="flex items-center gap-1.5">
                                            <BadgeCheck size={20} className='text-blue-600'  />
                                            <span>Séparation stricte de la logique métier pour un code propre, sécurisé et facile à maintenir</span>
                                        </li>

                                        <li className="flex items-center gap-1.5">
                                            <BadgeCheck size={20} className='text-blue-600' />
                                            <span>Interfaces fluides et optimisées pour maximiser ta visibilité et ton positionnement sur Google</span>
                                        </li>

                                        <li className="flex items-center gap-1.5">
                                            <BadgeCheck size={20} className='text-blue-600' />
                                            <span>Système de statistiques privé et sur-mesure pour suivre tes performances sans outils tiers</span>
                                        </li>

                                        <li className="flex items-center gap-1.5">
                                            <BadgeCheck size={20} className='text-blue-600' />
                                            <span>Optimisation totale de la vitesse de chargement et traitement intelligent des fichiers médias</span>
                                        </li>
                                    </ul>

                                    <div className="mt-8 space-y-4.5">
                                        <h2 className='font-medium text-lg'>Autres moyens de nous contacter</h2>
                                        <p>Vous pouvez également nous contacter via les réseaux sociaux ou par téléphone.</p>
                                        <div className=" grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                                            <div className="flex flex-col  gap-1">
                                                <Mail />
                                                <span><a href="mailto:dohfawaz90@gmail.com">dohfawaz90@gmail.com</a></span>
                                            </div>
                                            
                                            {/* Facebook SVG */}
                                            <div className="flex flex-col  gap-1">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-facebook">
                                                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
                                                </svg>
                                                <span><a href="https://www.facebook.com/votre_page" target="_blank" rel="noopener noreferrer">Fawse DOHOU</a></span>
                                            </div>

                                            {/* Twitter / X SVG */}
                                            <div className="flex flex-col  gap-1">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-twitter">
                                                    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/>
                                                </svg>
                                                <span><a href="https://twitter.com/votre_compte" target="_blank" rel="noopener noreferrer">@votre_compte</a></span>
                                            </div>

                                            {/* LinkedIn SVG */}
                                            <div className="flex flex-col  gap-1">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-linkedin">
                                                    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
                                                    <rect width="4" height="12" x="2" y="9"/>
                                                    <circle cx="4" cy="4" r="2"/>
                                                </svg>
                                                <span><a href="https://www.linkedin.com/in/votre_profil" target="_blank" rel="noopener noreferrer">Fawse DOHOU</a></span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}