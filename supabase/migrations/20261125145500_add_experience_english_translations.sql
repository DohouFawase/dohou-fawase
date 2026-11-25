alter table public.experiences
  add column if not exists role_en text,
  add column if not exists description_en text;

update public.experiences
set role_en = 'Full-Stack & Mobile Developer',
    description_en = 'End-to-end delivery of web and mobile products. Designed the admin and front-end for the L’Artisan Automobile project, and developed a full-stack spiritual retreat platform using Laravel and mobile technologies.'
where company = 'Avoaka Consulting'
  and role_en is null;

update public.experiences
set role_en = 'Frontend Web Developer',
    description_en = 'Front-end development of KuraScouting, an intelligent platform for identifying African football talent. Integrated APIs, visualized statistics, and improved the user experience (UX/UI).'
where company = 'GEODAFTAR'
  and role_en is null;

update public.experiences
set role_en = 'Full-Stack Developer',
    description_en = 'Designed a robust backend architecture using the Repository Pattern (Laravel, NestJS) and developed dynamic React interfaces with Redux Toolkit, TanStack Query, and React Hook Form.'
where company = 'HARNIS - SAS'
  and role_en is null;

update public.experiences
set role_en = 'Full-Stack Developer',
    description_en = 'Designed, integrated, and maintained interactive web applications end to end using the Laravel ecosystem for the back end and Vue.js for the front end.'
where company = 'H-KIM'
  and role_en is null;

update public.experiences
set role_en = 'Backend Developer',
    description_en = 'Developed a robust user management system in native PHP. Designed a secure database, managed sessions and access rights, and delivered a custom backend architecture.'
where company = 'Conforthouse'
  and role_en is null;
