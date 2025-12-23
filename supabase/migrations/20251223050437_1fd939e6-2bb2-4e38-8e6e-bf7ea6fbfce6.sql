-- Grant admin role to flowerexpressco.in@gmail.com
INSERT INTO public.user_roles (user_id, role)
VALUES ('96f54323-cb01-4dcf-ae19-265fd2ef36cb', 'admin')
ON CONFLICT (user_id, role) DO NOTHING;