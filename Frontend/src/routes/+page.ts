import { goto } from '$app/navigation';
import { token, user_username } from '$store/stores';

export async function _handleLogin(username: string, password: string) {
    const formData = new FormData();
    formData.append('username', username);
    formData.append('password', password);

    try {
        const response = await fetch('https://accounts-79lp.onrender.com/token', {
            method: 'POST',
            body: formData
        });

        if (response.ok) {
            const data = await response.json();
            const { access_token } = data;

            user_username.set(username);
            token.set({ access_token });
            localStorage.setItem('accessToken', access_token);
            document.cookie = `access_token=${access_token}; path=/;`;
            goto('/home');
        } else {
            throw new Error('Could not Login/obtain token');
        }
    } catch (error) {
        console.error(error);
    }
}
