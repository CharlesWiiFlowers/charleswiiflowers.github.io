import Card from './components/card.tsx';
import ProfileCard from './components/ProfileCard.tsx';
import SkillCard from './components/SkillCard.tsx';
import SocialCard from './components/SocialCard.tsx';
import ProjectCard from './components/ProjectCard.tsx';
import data from "./assets/data.json"

function InfoBody(){
    return (
        <div>
            <i className="devicon-arduino-plain-wordmark colored"></i>
            < ProfileCard title={data.name} subtitle='A software developer' avatarUrl='/avatar.webp'/>
            < Card title='About me' subtitle='' content={data['about-me']}/>
            < SkillCard title='My skills' data={data['skill-list']}/>
            < ProjectCard title='My project' data={data['project-list']} />
             < SocialCard title='My socials' data={data['social-media']}/>
        </div>)
}

function SwitchHeader(){
    return <div></div>
}

function ContentPage(){
    return (
        <div>
            < InfoBody />
            < SwitchHeader />
        </div>
    )
}

function BodyPage(){
    return < ContentPage />
}

export default function App(){
    return < BodyPage />;
}