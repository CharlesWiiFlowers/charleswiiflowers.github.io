import Card from './card.tsx';
import './profileCard.css'

function ProfileCard({title, subtitle,content, avatarUrl}:
     {title: string, subtitle:string,content:string, avatarUrl:string}){

        return (
            <Card title={title} subtitle={subtitle} content={content}>
                <img src={avatarUrl} alt="Profile Picture" className="profile-picture"/>
            </Card>
        )
    }


export default ProfileCard