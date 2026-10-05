-- =============================================================================
-- quan-portfolio — initial content (generated from lib/seed.ts)
-- Run AFTER schema.sql. It clears the content tables first, so only run it on a
-- fresh database (blogs and music are left untouched).
-- =============================================================================

begin;

delete from public.projects;
delete from public.education;
delete from public.experiences;
delete from public.skills;
delete from public.journey;

insert into public.profile (id, name, role, tagline, location, story, email, github_url, linkedin_url, resume_url, avatar_url, cover_url)
values (1, 'Nguyễn Trương Mạnh Quân', 'Software Engineer', 'Computer Science Student • Builder', 'Singapore', 'Hi, my name is Quan Nguyen. I''m a software engineer and computer science student passionate about building impactful products. I enjoy working on AI-powered applications, designing intuitive user interfaces, and developing scalable systems. My journey in technology has been driven by curiosity, creativity, and a desire to make a positive difference in the world.', 'nguyentruongmanhquan@gmail.com', 'https://github.com/NTMQuannuaQMTN', 'https://www.linkedin.com/in/nguyen-truong-manh-quan/', '/resume.pdf', '/images/profile-dark.png', '')
on conflict (id) do update set
  name = excluded.name, role = excluded.role, tagline = excluded.tagline, location = excluded.location,
  story = excluded.story, email = excluded.email, github_url = excluded.github_url,
  linkedin_url = excluded.linkedin_url, resume_url = excluded.resume_url,
  avatar_url = excluded.avatar_url, cover_url = excluded.cover_url;

insert into public.education (school, degree, start_month, end_month, detail, logo_url, sort_order) values
  ('National University of Singapore', 'B.Comp, Computer Science', date '2026-01-01', date '2030-01-01', 'Coursework: Data Structures & Algorithms, Systems Programming, AI Foundations.', '/images/logo-nus.png', 0),
  ('VNUHCM High School for the Gifted', 'Mathematics Specialized Program', date '2023-01-01', date '2026-01-01', 'Advanced mathematics and problem-solving track.', '/images/logo-ptnk.png', 1),
  ('Tran Dai Nghia High School for the Gifted', 'Secondary Education', date '2019-01-01', date '2023-01-01', 'Started programming and competed in first innovation competitions.', '/images/logo-tdn.png', 2);

insert into public.experiences (role, employment_type, company, logo_url, location, location_type, start_month, end_month, description, tech, sort_order) values
  ('Founder', '', 'Doorians Lab', '', '', '', date '2025-01-01', null, 'Building software solutions for educational organizations, startups, and student communities. Acting as both technical lead and product builder.', array['Next.js', 'TypeScript', 'Supabase']::text[], 0),
  ('Founder', '', 'Homee', '', '', '', date '2025-01-01', null, 'Developing a social platform designed around student groups, communities, and meaningful interactions.', array['React Native', 'Node.js', 'PostgreSQL']::text[], 1),
  ('Chief Technology Officer', '', 'The Noders Community', '', '', '', date '2025-01-01', null, 'Leading technical direction for an AI and technology community impacting students through events, workshops, and projects.', array['Leadership', 'AI', 'Community']::text[], 2),
  ('Junior Web Developer', '', 'Ricefield', '', '', '', date '2025-01-01', date '2025-01-01', 'Built frontend experiences using React and modern web technologies for a student-focused social platform.', array['React', 'JavaScript', 'CSS']::text[], 3),
  ('Software Engineering Intern', 'Internship', 'Garastem', '', '', '', date '2024-01-01', date '2025-01-01', 'Developed landing pages, CMS systems, and customer-facing platforms for a robotics company.', array['Next.js', 'CMS', 'Tailwind CSS']::text[], 4),
  ('Co-Founder', '', 'Digital Skillset Club', '', '', '', date '2024-01-01', date '2024-01-01', 'Taught programming and cybersecurity to students at SOS Children''s Village in Ho Chi Minh City.', array['Teaching', 'Python', 'Security Fundamentals']::text[], 5);

insert into public.projects (title, description, tech, image_url, project_url, start_month, end_month, sort_order) values
  ('Vũ Đại Dạ Huyết', 'Built a digital platform supporting an interactive board game that turns Vietnamese novels into a playable, social learning experience.

Impact: Used to manage gameplay, players, and educational interactive experiences in classroom settings.', array['React', 'JavaScript', 'CSS']::text[], '/images/project-vddh-cover.png', 'https://vu-dai-da-huyet-test2.vercel.app/', null, null, 0),
  ('EZ-Komu', 'Designed and built a technology-driven communication tool focused on making everyday interaction more accessible for people with muteness and deafness.

Impact: Reached Top 15 nationally in a countrywide innovation competition among 100+ teams.', array['JavaScript', 'HTML/CSS', 'Product Design']::text[], '/images/project-ezkomu.png', 'https://ntmquannuaqmtn.github.io/Quan-Quang-Phuoc-8A13/', null, null, 1),
  ('Math Olympiad & AI Training Program', 'Contributed curated Math Olympiad problem-solving data to a collaborative program organized by xAI and VNUHCM High School for the Gifted.

Impact: Data potentially contributed to training Grok and other advanced language models.', array['Mathematical Reasoning', 'Dataset Curation', 'AI Training Data']::text[], '/images/project-grok.png', '', null, null, 2),
  ('HCMC High School Platform', 'Developed a website that helps ninth-grade students find their most suitable high school ahead of the high school entrance exam.

Impact: Gives incoming high schoolers and their families a clearer, data-driven way to choose the right school instead of guessing.', array['Next.js', 'TypeScript', 'Data Analysis']::text[], '/images/project-hcmc-platform.png', 'https://hcmc-high-school-platform.vercel.app/', null, null, 3),
  ('EWC PUBG Prediction Engine', 'Built a machine learning pipeline that predicts team rankings for the EWC 2026 PUBG tournament from historical performance data.

Impact: Outputs team statistics, player metrics, rosters, and predicted rankings as CSVs for the EWC 2026 PUBG tournament.', array['Python', 'Jupyter', 'RandomForest', 'GraphQL']::text[], '', 'https://github.com/NTMQuannuaQMTN/ewcpubg', null, null, 4);

insert into public.skills (category, name, logo_url, sort_order) values
  ('Languages', 'TypeScript', 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg', 0),
  ('Languages', 'JavaScript', 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg', 1),
  ('Languages', 'Python', 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg', 2),
  ('Frontend', 'React', 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg', 3),
  ('Frontend', 'Next.js', 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg', 4),
  ('Frontend', 'React Native', 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg', 5),
  ('Frontend', 'Tailwind CSS', 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-original.svg', 6),
  ('Backend', 'Node.js', 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg', 7),
  ('Backend', 'Express', 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/express/express-original.svg', 8),
  ('Backend', 'FastAPI', 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/fastapi/fastapi-original.svg', 9),
  ('AI', 'OpenAI API', '', 10),
  ('AI', 'Python', 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg', 11),
  ('Cloud', 'Vercel', 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vercel/vercel-original.svg', 12),
  ('Cloud', 'Cloudflare', 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/cloudflare/cloudflare-original.svg', 13),
  ('Databases', 'PostgreSQL', 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg', 14),
  ('Databases', 'Supabase', 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/supabase/supabase-original.svg', 15),
  ('Tools', 'Git', 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg', 16),
  ('Tools', 'Figma', 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/figma/figma-original.svg', 17);

insert into public.journey (year, title, description, sort_order) values
  ('2017', 'Interest in Mathematics', 'Developed a strong interest in mathematics and problem solving.', 0),
  ('2019', 'Tran Dai Nghia High School for the Gifted', 'Entered one of Ho Chi Minh City''s leading secondary schools.', 1),
  ('2021', 'Started Coding', 'Discovered programming and began building software.', 2),
  ('2022', 'First Major Project', 'Built my first project and reached Top 15 nationally in an innovation competition.', 3),
  ('2023', 'VNUHCM High School for the Gifted', 'Entered the Mathematics specialized program.', 4),
  ('2024', 'Teaching & Competitive Programming', 'Co-founded a club teaching programming and cybersecurity, while competing in programming contests.', 5),
  ('2025', 'Founder', 'Founded Homee and Doorians Lab.', 6),
  ('2026', 'National University of Singapore', 'Started studying Computer Science at NUS.', 7);

commit;
