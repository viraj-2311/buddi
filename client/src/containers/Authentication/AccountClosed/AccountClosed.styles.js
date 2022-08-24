import styled from "styled-components";

const AccountClosedContainer = styled.div`

background-image:linear-gradient(to bottom,#2e2c6d,#5838a3 62%,#6b3dbc);
height:100%;

.account-close-outer{
    min-height:100vh;
    display:flex;
    flex-direction: column;
    align-items: center;
    .logo-white{
        width:116px;
        margin: 45px 0;
    }
    .account-close-inner{
        width:650px;
        background-color:#fff;
        text-align:center;
        border-radius:10px;
        @media screen and (max-width:767px){
            width:90%;
        }
        img{
            width:120px;
            @media screen and (max-width:767px){
                width:90px;
            }
        }
        h5{
            font-size:20px;
            font-weight:700;
            font-stretch: normal;
            font-style: normal;
            line-height: normal;
            letter-spacing: normal;
            text-align: center;
            color: #2f2e50;
            padding-top: 35px;
            @media screen and (max-width:767px){
                font-size: 16px;
            }
        }
        p{
            font-size: 18px;
            font-weight: normal;
            font-stretch: normal;
            font-style: normal;
            line-height: normal;
            letter-spacing: normal;
            text-align: center;
            color: #2f2e50;
            @media screen and (max-width:767px){
                font-size: 14px;
            }
        }
        button{
            margin:20px 0;
        }
        div{
            padding:40px 0 20px 0;
            @media screen and (max-width:767px){
                padding:40px 15px 20px 15px;
            }
        }
        hr{
            border-color: #b4b4c6;
            color:#b4b4c6;
            opacity: 0.5;
            margin:0px;
        }
    }

}
`;

export { AccountClosedContainer };

