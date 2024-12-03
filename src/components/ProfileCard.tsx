import Card from './card.tsx';
import './profileCard.css'

function ProfileCard({title, content, avatarUrl}:
     {title: string, content:string, avatarUrl:string}){

        return (
            <Card title={title} content={content}>
                <img src={avatarUrl} alt="Profile Picture" className="profile-picture"/>
            </Card>
        )
    }


export default ProfileCard