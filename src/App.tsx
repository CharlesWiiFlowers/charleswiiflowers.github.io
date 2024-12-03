import Card from './components/card.tsx';
import ProfileCard from './components/ProfileCard.tsx';
import data from "./assets/data.json"

function InfoBody(){
    return (
        <div>
            < ProfileCard title={data.name} subtitle='A software developer' content=' ' avatarUrl='/avatar.webp'/>
            < Card title='About me' subtitle='' content={data['about-me']}/>
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