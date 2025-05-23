class SqlSetBuilder
{
    private readonly List<string> campos = [];
    public SqlSetBuilder CondField(bool condition, string value)
    {
        if (condition)
            campos.Add(value);
        return this;
    }
	public string Build()
    {
        return string.Join(", ", campos); ;
    }
}