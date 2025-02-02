interface Barber {
    name: string;
    hairstyles: string[];
    rating: number;
    gender: string;
    dorm: string;
    neighborhood: string;
    "will-travel": boolean;
    biography: string;
    cost: number;
    example_images: string[];
    profile_image: string;
    _id: string;
  }

interface User {
	user_id: string;
	user_name: string;
	_id: string;
	dorm: string;
}


export type { Barber, User };