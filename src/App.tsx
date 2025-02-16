import Card from './components/card.tsx';
import ProfileCard from './components/ProfileCard.tsx';
import SkillCard from './components/SkillCard.tsx';
import SocialCard from './components/SocialCard.tsx';
import ProjectCard from './components/ProjectCard.tsx';
import ParticlesBg from './components/ParticlesBg.tsx';
import Footer from './components/Footer.tsx';
import data from "./assets/data.json"

function InfoBody() {
    return (
        <div>
            < ProfileCard title={data.name} subtitle='A software developer' avatarUrl={data['avatar-url']} />
            < Card title='About me' subtitle='' content={data['about-me']} />
            < SkillCard title='My skills' data={data['skill-list']} />
            < ProjectCard title='My project' data={data['project-list']} />
            < SocialCard title='My socials' data={data['social-media']} />
        </div>)
}

function SwitchHeader() {
    return <div></div>
}

function ContentPage() {
    return (
        <div>
            < InfoBody />
            < SwitchHeader />
        </div>
    )
}

function BodyPage() {
    return (
        <div>
            < ContentPage />
        </div>
    )
}

export default function App() {
    return (<div>< ParticlesBg />< BodyPage />< Footer /></div>);
}