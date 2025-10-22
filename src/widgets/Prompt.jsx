import React from 'react';
import Upload from '../components/Upload';
import Keyword from '../components/Keyword';
import Input from '../components/Input';
import GenerateButton from '../components/GenerateButton';

export default function Prompt({
    t,
    setImage,
    language,
    setLanguage,
    keyword,
    setKeyword,
    style,
    setStyle,
    loading,
    handleGenerate
}) {
    return (
        <form action="" onSubmit={handleGenerate}>
            <Upload setImage={setImage} />

            <Keyword 
                placeholder={t("placeholder.concept")}
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                required />

            <div className='flex'> 
                <Input 
                placeholder={t("placeholder.language")}
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                required />

                <Input
                    placeholder={t("placeholder.style")}
                    value={style}
                    onChange={(e) => setStyle(e.target.value)} 
                    required />
            </div>

            <GenerateButton loading={loading} t={t} onClick={handleGenerate} />
        </form>
    )
}