// --- BLOC UNIQUE DE CONFIGURATION DES TAGS ---
export const TAG_DATA = {
    revenus: {
        label: "💰 Revenus",
        items: {
            salaire: { icon: "💶", label: "Salaire" },
            aides: { icon: "🏛️", label: "Aides/CAF" },
            remboursement: { icon: "🔄", label: "Remboursement" },
            ventes: { icon: "📦", label: "Ventes" },
            divers: { icon: "➕", label: "Divers" }
        }
    },
    alimentation: {
        label: "🍔 Alimentation",
        items: {
            courses: { icon: "🛒", label: "Courses" },
            resto: { icon: "🍽️", label: "Resto" },
            fastfood: { icon: "🍔", label: "Fast-Food" },
            boulangerie: { icon: "🥖", label: "Boulangerie" },
            boucherie: { icon: "🥩", label: "Boucherie" },
            marche: { icon: "🍎", label: "Marché" },
            cantine: { icon: "🍱", label: "Cantine" },
            bar: { icon: "🍺", label: "Bar" },
            livraison: { icon: "🛵", label: "Livraison" }
        }
    },
    vehicule: {
        label: "🚗 Véhicules",
        items: {
            carburant: { icon: "⛽", label: "Carburant" },
            entretien_auto: { icon: "🔧", label: "Entretien Auto" },
            entretien_moto: { icon: "🏍️", label: "Entretien Moto" },
            transport: { icon: "🚌", label: "Transports" },
            train: { icon: "🚆", label: "Train" },
            avion: { icon: "✈️", label: "Avion" },
            taxi: { icon: "🚕", label: "Taxi" },
            peage: { icon: "🎫", label: "Péage" },
            parking: { icon: "🅿️", label: "Parking" },
            velo: { icon: "🚲", label: "Vélo/Trot" }
        }
    },
    maison: {
        label: "🏠 Maison",
        items: {
            loyer_credit: { icon: "🏠", label: "Loyer/Crédit" },
            energie: { icon: "⚡", label: "Élec/Gaz" },
            eau: { icon: "💧", label: "Eau" },
            assurance: { icon: "🛡️", label: "Assurance" },
            internet: { icon: "🌐", label: "Internet/Forfait" },
            equipement: { icon: "📺", label: "Équipement" },
            entretien: { icon: "🧹", label: "Entretien" },
            decoration: { icon: "🛋️", label: "Décoration" },
            brico_jardin: { icon: "🛠️", label: "Brico/Jardin" },
            travaux: { icon: "🏗️", label: "Travaux" }
        }
    },
    shopping: {
        label: "🛍️ Shopping & Perso",
        items: {
            vetements: { icon: "👕", label: "Vêtements" },
            chaussures: { icon: "👟", label: "Chaussures" },
            accessoires: { icon: "⌚", label: "Accessoires" },
            cadeaux: { icon: "🎁", label: "Cadeaux" }
        }
    },
    loisirs: {
        label: "🍿 Loisirs",
        items: {
            activite: { icon: "🔫", label: "Activités" },
            vape: { icon: "💨", label: "Vape" },
            cinema: { icon: "🍿", label: "Cinéma" },
            gaming: { icon: "🎮", label: "Gaming" },
            musique: { icon: "🎵", label: "Musique" },
            streaming: { icon: "📺", label: "Streaming" },
            lecture: { icon: "📚", label: "Lecture" },
            presse: { icon: "📰", label: "Presse" },
            sorties: { icon: "🎟️", label: "Sorties" },
            voyage: { icon: "🏖️", label: "Voyage" },
            tabac: { icon: "🚬", label: "Tabac" },
            numerique: { icon: "📱", label: "Logiciels/Apps" },
            abonnements: { icon: "💳", label: "Abonnements" }
        }
    },
    sante: {
        label: "💊 Santé",
        items: {
            generaliste: { icon: "👨‍⚕️", label: "Généraliste" },
            hopital: { icon: "🏥", label: "Hôpital" },
            cpam: { icon: "📂", label: "CPAM" },
            mutuelle: { icon: "🏥", label: "Mutuelle" },
            pharmacie: { icon: "⚕️", label: "Pharmacie" },
            laboratoire: { icon: "🔬", label: "Laboratoire" },
            complements: { icon: "🌿", label: "Compléments" },
            therapie: { icon: "🧘", label: "Thérapie" }
        }
    },
    specialistes: {
        label: "🩺 Spécialistes",
        items: {
            cardiologue: { icon: "❤️", label: "Cardiologue" },
            dentiste: { icon: "🦷", label: "Dentiste" },
            ophtalmologue: { icon: "👁️", label: "Ophtalmo" },
            dermatologue: { icon: "🩺", label: "Dermatologue" },
            orl: { icon: "👂", label: "ORL" },
            pneumologue: { icon: "🫁", label: "Pneumologue" },
            gastro: { icon: "🥨", label: "Gastro-entéro" },
            radiologue: { icon: "☢️", label: "Radiologue" },
            kine: { icon: "🧘", label: "Kiné" },
            osteo: { icon: "🦴", label: "Ostéo" },
            podologue: { icon: "🦶", label: "Podologue" }
        }
    },
    beaute: {
        label: "💄 Beauté",
        items: {
            coiffeur: { icon: "✂️", label: "Coiffeur" },
            hygiene: { icon: "🧴", label: "Hygiène" },
            cosmetique: { icon: "💅", label: "Cosmétique" }
        }
    },
    sport: {
        label: "🏋️ Sports",
        items: {
            licence: { icon: "💳", label: "Licence" },
            equipement: { icon: "👟", label: "Équipement" },
            competition: { icon: "🏅", label: "Compétition" },
            piscine: { icon: "🏊", label: "Piscine" },
            running: { icon: "🏃", label: "Running" },
            musculation: { icon: "💪", label: "Musculation" },
            cyclisme: { icon: "🚴", label: "Cyclisme" },
            randonnee: { icon: "🏔️", label: "Randonnée" },
            combat: { icon: "🥊", label: "Combat" },
            raquette: { icon: "🎾", label: "Raquette" },
            collectif: { icon: "⚽", label: "Collectif" }
        }
    },
    famille: {
        label: "👧 Famille",
        items: {
            enfants: { icon: "👧", label: "Enfants" },
            ecole: { icon: "🎒", label: "École/Périscolaire" },
            jouets: { icon: "🧸", label: "Jouets" },
            garde: { icon: "🍼", label: "Garde/Nounou" },
            animaux: { icon: "🐶", label: "Animaux" },
            veterinaire: { icon: "🩺", label: "Vétérinaire" },
            argent_poche: { icon: "🪙", label: "Argent de poche" }
        }
    },
    pro: {
        label: "💼 Frais Pro",
        items: {
            repas: { icon: "🍽️", label: "Repas Pro" },
            deplacement: { icon: "🚗", label: "Déplacement" },
            hotel: { icon: "🏨", label: "Hôtel" },
            materiel: { icon: "💻", label: "Matériel Pro" },
            fournitures: { icon: "📎", label: "Fournitures" }
        }
    },
    finance: {
        label: "🏦 Finances & Admin",
        items: {
            frais_bancaires: { icon: "🏦", label: "Frais Bancaires" },
            epargne: { icon: "🐷", label: "Épargne" },
            impots: { icon: "📄", label: "Impôts/Taxes" },
            justice: { icon: "⚖️", label: "Justice" },
            notaire: { icon: "✒️", label: "Notaire" },
            amende: { icon: "👮", label: "Amende" },
            dons: { icon: "🤝", label: "Dons" },
            poste: { icon: "📮", label: "Poste" },
            divers: { icon: "📝", label: "Divers" }
        }
    }
};

// --- GÉNÉRATION AUTOMATIQUE DES VARIABLES UTILISÉES PAR L'APP ---
export const EXPENSE_TAGS = {};
export const TAG_CATEGORIES = {};

Object.keys(TAG_DATA).forEach(catKey => {
    const category = TAG_DATA[catKey];
    // On extrait les clés pour TAG_CATEGORIES
    TAG_CATEGORIES[catKey] = { 
        label: category.label, 
        keys: Object.keys(category.items) 
    };
    // On fusionne tous les items dans EXPENSE_TAGS
    Object.assign(EXPENSE_TAGS, category.items);
});

// ============================================================
// GESTIONNAIRE DE TAGS — Custom + Activation/Désactivation
// ============================================================

export const TAG_EMOJI_PICKER = [
    '🏠','🛒','🍽️','🍺','🎁','🏖️','✈️','🚗',
    '🎮','🎵','🎬','📚','🎯','🏋️','🐶','👶',
    '💰','🐷','💳','📱','💼','🔧','🌿','⭐',
    '🎰','✂️','🍕','☕','🧴','💊','🎪','🕯️',
    '🏊','🚴','⚽','🎾','🏔️','🌊','🎣','🎨',
    '🍷','🧁','🌺','🦋','✨','🎭','🪴','🦄'
];
