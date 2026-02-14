export interface Country {
    name: string;
    code: string;
    dialCode: string;
    flag: string;
    format?: string;
}

export const countries: Country[] = [
    { name: "India", code: "IN", dialCode: "+91", flag: "🇮🇳", format: "XXXXX XXXXX" },
    { name: "United States", code: "US", dialCode: "+1", flag: "🇺🇸", format: "(XXX) XXX-XXXX" },
    { name: "United Kingdom", code: "GB", dialCode: "+44", flag: "🇬🇧", format: "XXXX XXX XXX" },
    { name: "United Arab Emirates", code: "AE", dialCode: "+971", flag: "🇦🇪", format: "XX XXX XXXX" },
    { name: "Canada", code: "CA", dialCode: "+1", flag: "🇨🇦", format: "(XXX) XXX-XXXX" },
    { name: "Australia", code: "AU", dialCode: "+61", flag: "🇦🇺", format: "XXXX XXX XXX" },
    { name: "Singapore", code: "SG", dialCode: "+65", flag: "🇸🇬", format: "XXXX XXXX" },
    { name: "Germany", code: "DE", dialCode: "+49", flag: "🇩🇪", format: "XXX XXXXXXX" },
    { name: "France", code: "FR", dialCode: "+33", flag: "🇫🇷", format: "X XX XX XX XX" },
    { name: "Japan", code: "JP", dialCode: "+81", flag: "🇯🇵", format: "XX-XXXX-XXXX" },
    { name: "China", code: "CN", dialCode: "+86", flag: "🇨🇳", format: "XXX XXXX XXXX" },
    { name: "Brazil", code: "BR", dialCode: "+55", flag: "🇧🇷", format: "(XX) XXXXX-XXXX" },
    { name: "South Africa", code: "ZA", dialCode: "+27", flag: "🇿🇦", format: "XX XXX XXXX" },
    { name: "Saudi Arabia", code: "SA", dialCode: "+966", flag: "🇸🇦", format: "XX XXX XXXX" },
    { name: "Malaysia", code: "MY", dialCode: "+60", flag: "🇲🇾", format: "XX-XXX XXXX" },
    { name: "Thailand", code: "TH", dialCode: "+66", flag: "🇹🇭", format: "XX XXX XXXX" },
    { name: "Indonesia", code: "ID", dialCode: "+62", flag: "🇮🇩", format: "XXX-XXX-XXXX" },
    { name: "Philippines", code: "PH", dialCode: "+63", flag: "🇵🇭", format: "XXX XXX XXXX" },
    { name: "Vietnam", code: "VN", dialCode: "+84", flag: "🇻🇳", format: "XXX XXX XXXX" },
    { name: "South Korea", code: "KR", dialCode: "+82", flag: "🇰🇷", format: "XX-XXXX-XXXX" }
];

export const getCountryByCode = (code: string): Country | undefined => {
    return countries.find(country => country.code === code);
};

export const getCountryByDialCode = (dialCode: string): Country | undefined => {
    return countries.find(country => country.dialCode === dialCode);
};

export const searchCountries = (query: string): Country[] => {
    const lowerQuery = query.toLowerCase();
    return countries.filter(country =>
        country.name.toLowerCase().includes(lowerQuery) ||
        country.dialCode.includes(query) ||
        country.code.toLowerCase().includes(lowerQuery)
    );
};
